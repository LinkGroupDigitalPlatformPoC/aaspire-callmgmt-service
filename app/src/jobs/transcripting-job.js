
class TranscribingJob {
    constructor(mongodb, transcriptor, workersAllowance) {
        this.mongodb = mongodb;
        this.transcriptor = transcriptor;
        this.workersAllowance = workersAllowance;
    }

    run() {
        console.log("Transcripting .... ")
        var that = this;
        this.callsToTranscript().then(this.transcriptCalls.bind(that))
    }

    transcriptCalls(calls) {
        calls.forEach(call => this.transcriptCall(call))
    }

    transcriptCall(call) {
        var that = this;

        this.transcriptor(this.mongodb, call.audioFile)
            .then(transcription => that.updateCallWithTranscript(call, transcription))
            .catch(e => console.log(e));
    }

    updateCallWithTranscript(call, transcript) {
        return new Promise((resolve, reject) => {
            const oId = call._id;

            this.mongodb.collection("calls").update({_id: oId}, {$set: {transcript: transcript}}, (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
        })
    }

    callsToTranscript() {
        return new Promise((resolve, reject) => {
            const query = {audioFile: {$ne: null},transcript: null}
            this.mongodb.collection("calls").find(query).toArray((err, payload) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(payload.slice(0, this.workersAllowance))
                    }
                });
        })
    }

}



module.exports = TranscribingJob;
