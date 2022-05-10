const TableNews = require('../db/db-news.js');
const { KEYWORD } = require('../constants.js');
const Util = require('../utility/util');

let publisher;

class SubscribeSaveNews {
    constructor() {
        this.listOfId = [];
        this.tnews = new TableNews();
    }

    // singleton pattern
    static get instance() {
        if (!this[Symbol.for('instance')]) {
            this[Symbol.for('instance')] = new SubscribeSaveNews();
        }
        return this[Symbol.for('instance')];
    }

    static SetPublisher(pub) {
        publisher = pub;
    }

    static process(message) {
        const app = SubscribeSaveNews.instance;
        const data = JSON.parse(message);
        if (!app.listOfId.includes(data.id)) {
            app.listOfId.push(data.id);
            console.log(message);
            (async () => {
                const id = await app.tnews.addNews(data.id, message);
                if (id > 0 && publisher !== undefined)
                    await publisher.Publish(KEYWORD.PUB_SCORE_NEWS, message);
            })();
            if (app.listOfId.length > 100)
                app.listOfId = app.listOfId.splice(0, 50);
        }
    }

    static Run(message) {
        Util.SafeExecute('SubscribeSaveNews', SubscribeSaveNews.process, message);
    }

}

module.exports = SubscribeSaveNews;
