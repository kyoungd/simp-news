const moment = require('moment')
const { KEYWORD } = require('./src/constants.js');
const RedisPubSub = require('./src/redis-pubsub.js');
const Util = require('./src/utility/util.js');
const { ChannelFunctionList, SetChanFuncPublisher } = require('./src/pubsub/channel-function-list.js');
const { HttpGetMessage } = require('./src/pubsub/sub-post-news.js');

const redis = new RedisPubSub();

(async () => {
    await redis.Subscribe(ChannelFunctionList);
    SetChanFuncPublisher(redis);
})();

const pubNews = async (news) => {
    const news = Util.WithoutProperty(data[key], 'content');
    await redis.Publish(KEYWORD.PUB_SAVE_NEWS, JSON.stringify(news));
}

const urlDateTimeParameter = (oneDate, index) => {
    const segment = 4;
    const segmentHours = 24 / segment;
    let dtime = moment(startDate);
    const offsetDays = index / segment;
    const offsetHours = (index % 4) * segmentHours;
    dtime = dtime.add(offsetDays, 'days');
    dtime = dtime.add(offsetHours, 'hours');
}

const Run = async (endDate, numDays) => {
    const url = KEYWORD.ALPACA_HISTORICAL_NEWS_URL;
    const dStartDate = moment(endDate).add(numDays, 'days');
    const dEndDate = moment(endDate);
    let index = 0;
    while (true) {
        const post = HttpGetMessage.instance;
        const sdate = urlDateTimeParameter(oneDate, index);
        const edate = urlDateTimeParameter(oneDate, index + 1);
        ++index;
        const url = Util.Format(KEYWORD.ALPACA_HISTORICAL_NEWS_URL, sdate, edate);
        const message = await post.Run(url);
        console.log(message);
        // await pubNews(message);
        if (edate >= endDate) break;
    }
    console.log('download complete');
}

(async() => {
    endDateDate = '2020-10-09T13:00:00-05:00';
    numDays = -21;
})();
