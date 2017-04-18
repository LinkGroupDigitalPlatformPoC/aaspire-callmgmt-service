const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
const speech_to_text = new SpeechToTextV1();
const mongodb = require('mongodb');
const _ = require('lodash');
const invariant = require('invariant');

function analyse(db, file) {
    return new Promise((resolve, reject) => {
        const recogniserStream = openStreamToFile(file, db);

        // Will aggregate intermediate results here ...
        const results = [];

        // Results will come bit byt bit - need to aggregate them
        recogniserStream.on('results', e => onStreamResult(results, e));
        recogniserStream.on('speaker_labels', e => onSpeakerLabels(results, e));

        recogniserStream.on('error', (err) => {
            console.log(err)
            reject(err);
        });

        recogniserStream.on('close', function () {
            const transcript = parseResults(results);
            console.log(transcript);
            resolve(transcript);
        });
    });
}

function parseResults(results) {
    // All timestamps and labels - "matched" arrays
    const timestamps = timestampsFromResult(results);
    const labels = speakerLabelsFromResult(results);

    const buffer = [];
    let callCentreLabel = null;
    let lastLabel = null;
    var i, j;

    outer:
    for (i = 0, j = 0; i < timestamps.length && j < labels.length; ++i, ++j) {
        // Bending over backwards to match the timestamps :(
        while(timestamps[i][1] !== labels[j].from) {
            if(timestamps[i][1] > labels[j].from) {
                j++;
            } else if(timestamps[i][1] < labels[j].from) {
                i++;
            }
            if(i < timestamps.length && j < labels.length) {
                break outer;
            }
        }

        invariant(timestamps[i][1] === labels[j].from, "Must have same from");
        invariant(timestamps[i][2] === labels[j].to, "Must have same to");

        let word = timestamps[i][0];
        let label = labels[j].speaker;

        // First label is the Call-Centre
        callCentreLabel = callCentreLabel === null ? label : callCentreLabel;
        const readableLabel = label === callCentreLabel ? "Call-Centre" : "Client";

        // On label change - insert label delimeter
        if (label !== lastLabel) {
            buffer.push("\n");
            buffer.push(readableLabel);
            buffer.push(": ");
            lastLabel = label
        }

        // Insert the word itself
        buffer.push(word);
        buffer.push(" ");
    }

    return buffer.join("").trim();
}

function timestampsFromResult(results) {
    return _.compact([].concat(...results.map(r => r.timestamps)));
}

function speakerLabelsFromResult(results) {
    // Get all labels - there may be "repetitions" for the same timestamp 
    const rawLabels = _.compact([].concat(...results.map(r => r.labels)));

    // Remove the timestamp repetitions - ensure the highest confidence is left.
    const groupedLabels = _.groupBy(rawLabels, 'from');
    const groupedLabelsArr = _.values(groupedLabels);
    const labels = groupedLabelsArr.map(g => _.maxBy(g, 'confidence'));

    // Sort them bu the timstamp
    return _.sortBy(labels, 'from');
}

function onStreamResult(results, e) {
    const lastResult = results[e.result_index] || {};

    results[e.result_index] = {
        timestamps: e.results[0].alternatives[0].timestamps,
        labels: e.speaker_labels || lastResult.labels
    }
}

function onSpeakerLabels(results, e) {
    results[e.result_index] = results[e.result_index] || {};
    const lastResult = results[e.result_index];
    lastResult.labels = e.speaker_labels || lastResult.labels
}

function openStreamToFile(file, db) {
    // Mongo GridFS bucker
    let bucket = new mongodb.GridFSBucket(db, {bucketName: 'records'});

    // Watson params
    let params = {
        content_type: 'audio/wav',
        speaker_labels: true,
        inactivity_timeout: 60
    };

    let recogniserStream = speech_to_text.createRecognizeStream(params)
    recogniserStream.setEncoding('utf8');
    bucket.openDownloadStreamByName(file).pipe(recogniserStream)

    return recogniserStream;
}

module.exports = analyse;
