const axios = require('axios');
const { KEYWORD } = require('../constants.js');
const logger = require('../utility/logger.js');
const TableNews = require('../db/db-news.js');
const Util = require('../utility/util');
const { join } = require('@prisma/client/runtime/index.js');

class HttpGetMessage {
    constructor() {
        this.apiKey = KEYWORD.API_KEY;
        this.secretKey = KEYWORD.SECRET_KEY;
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
            headers: {
                'APCA-API-KEY-ID': this.apiKey,
                'APCA-API-SECRET-KEY': this.secretKey
            }
        };
    }

    async Run(url) {
        try {
            const config = this.getHeader(this.token);
            const result = await axios.get(url, config);
            return result;
        }
        catch (e) {
            logger.error(e)
            logger.error(e.stack);
            return null;
        }
    }

}

class SubscribePostNews {
    constructor() {
        this.isRunning = false;
        this.url = KEYWORD.POST_NEWS_URL;
        this.token = KEYWORD.POST_NEWS_SYSOP_TOKEN.jwt;
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
            headers: { Authorization: `Bearer ${token}` },
            "Content-Type": "application/json"
        };
    }

    async PostData(url, token, message) {
        try {
            const config = this.getHeader(token);
            const bodyJson = JSON.parse(message);
            const result = await axios.post(url, bodyJson, config);
            return result;
        }
        catch (e) {
            logger.error(e)
            logger.error(e.stack);
            return null;
        }
    }

    static process(message) {
        const app = SubscribePostNews.instance;
        (async () => {
            const result = await app.PostData(app.url, app.token, message);
            if (result !== null) {
                const id = result.data.data.attributes.nid;
                await app.tnews.addIsPost(id);
            }
        })();
    }

    static Run(message) {
        Util.SafeExecute('SubscribePostNews', SubscribePostNews.process, message);
    }

}

module.exports = {SubscribePostNews, HttpGetMessage};
