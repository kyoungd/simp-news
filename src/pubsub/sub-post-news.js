const axios = require('axios');
const { KEYWORD } = require('../constants.js');
const logger = require('../utility/logger.js');
const TableNews = require('../db/db-news.js');
const Util = require('../utility/util');

class HttpGetMessage {
    constructor() {
        this.token = KEYWORD.POST_NEWS_SYSOP_TOKEN;
    }

    // singleton pattern
    static get instance() {
        if (!this[Symbol.for('instance')]) {
            this[Symbol.for('instance')] = new HttpGetMessage();
        }
        return this[Symbol.for('instance')];
    }

    getHeader(token) {
        return {
            headers: { Authorization: `Bearer ${token}` }
        };
    }

    async Run(url) {
        const config = this.getHeader(this.token);
        const result = await axios.get(url, config);
        return result;
    }

}

class SubscribePostNews {
    constructor() {
        this.isRunning = false;
        this.url = KEYWORD.POST_NEWS_URL;
        this.token = KEYWORD.POST_NEWS_SYSOP_TOKEN;
        this.tnews = new TableNews();
    }

    // singleton pattern
    static get instance() {
        if (!this[Symbol.for('instance')]) {
            this[Symbol.for('instance')] = new SubscribePostNews();
        }
        return this[Symbol.for('instance')];
    }

    getHeader(token) {
        return {
            headers: { Authorization: `Bearer ${token}` }
        };
    }

    async PostData(url, token, textdata) {
        const config = this.getHeader(token);
        const bodyJson = textdata;
        const result = await axios.post(url, bodyJson, config);
        return result;
    }

    static process(message) {
        const app = SubscribePostNews.instance;
        (async () => {
            const data = JSON.parse(message);
            const result = await app.PostData(app.url, app.token, data);
            await app.tnews.addIsPost(data.id);
        })();
    }

    static Run(message) {
        Util.SafeExecute('SubscribePostNews', SubscribePostNews.process, message);
    }

}

module.exports = (SubscribePostNews, HttpGetMessage};
