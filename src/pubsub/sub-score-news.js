const TableNews = require('../db/db-news.js');
const Sentiment = require('./sentiment.js');
const { KEYWORD } = require('../constants.js');
const Util = require('../utility/util');

let publisher;

class SubscribeScoreNews {
    constructor() {
        this.sentiment = Sentiment.instance;
        this.tnews = new TableNews();
    }

    static get instance() {
        if (!this[Symbol.for('instance')]) {
            this[Symbol.for('instance')] = new SubscribeScoreNews();
        }
        return this[Symbol.for('instance')];
    }

    static SetPublisher(pub) {
        publisher = pub;
    }

    static process(message) {
        const app = SubscribeScoreNews.instance;
        console.log('Sentiment');
        console.log(message);
        const data = JSON.parse(message);
        (async () => {
            const textmsg = data['headline'] + ' ' + data['summary'];
            const sentiment = await app.sentiment.Run(textmsg);
            const isUpdateOk = await app.tnews.addSentiment(data.id, sentiment);
            if (publisher !== undefined) {
                data['sentiment'] = sentiment;
                await publisher.Publish(KEYWORD.PUB_POST_NEWS, JSON.stringify(data));
            }
            console.log(isUpdateOk);
        })();
    }

    static Run(message) {
        Util.SafeExecute('SubscribeScoreNews', SubscribeScoreNews.process, message);
    }

}

module.exports = SubscribeScoreNews;
