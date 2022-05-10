const axios = require('axios');
const { KEYWORD } = require('../constants.js');
const logger = require('../utility/logger.js');

class Sentiment {
    constructor() {
        this.isRunning = false;
    }

    // singleton pattern
    static get instance() {
        if (!this[Symbol.for('instance')]) {
            this[Symbol.for('instance')] = new Sentiment();
        }
        return this[Symbol.for('instance')];
    }

    async Run(textdata) {
        try {
            const url = KEYWORD.URL_SENTIMENT_ANALYSYS;
            const bodyJson = { text: textdata }
            const result = await axios.post(url, bodyJson);
            const sentiment = result.data.reduce((acc, cur) => {  // get the first one
                return acc + cur.sentiment_score;
            }, 0) / result.data.length; // get the average of all sentiment values in the array result.data 
            return sentiment;
        }
        catch (e) {
            logger.error(e)
            logger.error(e.stack);
            return 0;
        }
    }

}

module.exports = Sentiment;
