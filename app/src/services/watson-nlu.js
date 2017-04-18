const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
const nlu = new NaturalLanguageUnderstandingV1({version_date: NaturalLanguageUnderstandingV1.VERSION_DATE_2017_02_27});

function analyse(text) {
    return new Promise((resolve, reject) => {
        nlu.analyze({
                text: text,
                features: {
                    emotion: {},
                    sentiment: {}
                }
            }, function (err, response) {
                if (err) {
                    reject(err);
                } else {
                    resolve(response);
                }
            });
    });
}

module.exports = analyse;
