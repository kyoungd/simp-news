const SubscribeSaveNews = require('./sub-save-news.js');
const SubscribeScoreNews = require('./sub-score-news.js');
const { SubscribePostNews } = require('./sub-post-news.js');
const { KEYWORD } = require('../constants.js');

const ChannelFunctionList = [
        { key: KEYWORD.PUB_SAVE_NEWS, func: SubscribeSaveNews.Run },
        { key: KEYWORD.PUB_SCORE_NEWS, func: SubscribeScoreNews.Run },
        { key: KEYWORD.PUB_POST_NEWS, func: SubscribePostNews.Run }
    ]

const SetChanFuncPublisher = (publisher) => {
    SubscribeSaveNews.SetPublisher(publisher);
    SubscribeScoreNews.SetPublisher(publisher);
}

module.exports = { ChannelFunctionList, SetChanFuncPublisher }
