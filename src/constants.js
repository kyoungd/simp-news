const GetJwt = require('./getJwt.js');
const dotenv = require('dotenv');
dotenv.config();

class PrivateSingleton {
    constructor() {
        this.jwt = '';
        this.getJwt();
    }

    getJwt() {
        GetJwt.run().then(token => {
            this.jwt = token;
        });
    }

}

class Singleton {
    constructor() {
        throw new Error('Use Singleton.getInstance()');
    }
    static getInstance() {
        if (!Singleton.instance) {
            Singleton.instance = new PrivateSingleton();
        }
        return Singleton.instance;
    }
}

const instance = Singleton.getInstance();

const KEYWORD = {
    PUB_SAVE_NEWS: 'KEY_SAVE_NEWS',
    PUB_SCORE_NEWS: 'KEY_SCORE_NEWS',
    PUB_POST_NEWS: 'KEY_POST_NEWS',
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    API_KEY: process.env.ALPACA_API_KEY,
    SECRET_KEY: process.env.ALPACA_SECRET_KEY,
    TABLENAME_NEWS: 'news',
    URL_SENTIMENT_ANALYSYS: process.env.URL_SENTIMENT_ANALYSYS,
    POST_NEWS_URL: process.env.POST_NEWS_URL,
    POST_NEWS_SYSOP_TOKEN: instance,
    ALPACA_HISTORICAL_NEWS_URL: process.env.ALPACA_HISTORICAL_NEWS_URL
}

module.exports = { KEYWORD }
