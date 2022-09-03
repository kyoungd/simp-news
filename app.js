const moment = require('moment')
const { KEYWORD } = require('./src/constants.js');
const RedisPubSub = require('./src/redis-pubsub.js');
const Util = require('./src/utility/util.js');
const { HttpGetMessage } = require('./src/pubsub/sub-post-news.js');
const { ChannelFunctionList, SetChanFuncPublisher } = require('./src/pubsub/channel-function-list.js');

const redis = new RedisPubSub();
const segment = 96;

const pubNews = async (data) => {
    const news = Util.WithoutProperty(data, 'content');
    await redis.Publish(KEYWORD.PUB_SAVE_NEWS, JSON.stringify(news));
}

const publishBlockNews = async (data) => {
    for (let row of data)
        await pubNews(row);
}

const urlDateTimeParameter = (onedate, index) => {
    const segmentMinutes = Math.trunc(1440 / segment);
    const offsetDays = Math.trunc(index / segment);
    const offsetMinutes = (index % segment) * segmentMinutes;
    const dtime1 = onedate.add(offsetDays, 'days');
    const dtime2 = dtime1.add(offsetMinutes, 'minutes');
    return dtime2;
}

const getNews = async(dStart, index) => {
    // deep copy of the start datetime object.  It will not work properly without this.
    const startdate1 = moment(dStart.format());
    const startdate2 = moment(dStart.format());
    const post = HttpGetMessage.instance;
    const sdate = urlDateTimeParameter(startdate1, index);
    const param1 = sdate.format();
    const edate = urlDateTimeParameter(startdate2, index + 1);
    const param2 = edate.format();
    const url = Util.Format(KEYWORD.ALPACA_HISTORICAL_NEWS_URL, param1, param2);
    const message = await post.Run(url);
    return message;
}

const finalDate = (dStart, index) => {
    const startdate2 = moment(dStart.format());
    const edate = urlDateTimeParameter(startdate2, index + 1);
    return edate;
}

const Run = async (endDate, numDays) => {
    numDays = numDays < 0 ? numDays : -numDays;
    const url = KEYWORD.ALPACA_HISTORICAL_NEWS_URL;
    const dStart = moment(endDate).add(numDays, 'days');
    const dEnd = moment(endDate);
    let index = 0;
    while (true) {
        try {
            const message = await getNews(dStart, index);
            if ((message.status === 200) && (message.data.news.length > 0)) {
                console.log(message.data.news.length);
                await publishBlockNews(message.data.news);
            }
            if (finalDate(dStart, index) >= dEnd) break;
            ++index;
            if (index % 10 === 0) {
                console.log(message.data.news);
                console.log(finalDate(dStart, index).format());
            }
        }
        catch(e) {
            console.log('index: ', index);
            console.log(e);
        }
    }
    console.log('download complete');
}

(async() => {
    console.log('start app');
    const endDate = '2022-05-30T17:25:00-07:00';
    const numDays = 3;

    await redis.Connect();
    await redis.Subscribe(ChannelFunctionList);
    SetChanFuncPublisher(redis);
    await Run(endDate, numDays);
})();
