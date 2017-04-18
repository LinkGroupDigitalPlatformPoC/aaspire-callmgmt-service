function analyse(text) {
    return new Promise((resolve, reject) => {
        resolve({
            sentiment: {
                document: {
                    score: 0.5,
                    label: "positive"
                }
            },
            emotion: {
                document: {
                    emotion: {
                        sadness: 0.1,
                        joy: 0.1,
                        fear: 0.1,
                        disgust: 0.1,
                        anger: 0.1
                    }
                }
            },
            language: "en"
        });
    })
}

module.exports = analyse;
