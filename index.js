const WebSocket = require('ws');
const { KEYWORD } = require('./src/constants.js');
const RedisPubSub = require('./src/redis-pubsub.js');
const Util = require('./src/utility/util.js');
const { ChannelFunctionList, SetChanFuncPublisher } = require('./src/pubsub/channel-function-list.js');
const TableNews = require('./src/db/db-news.js');

const callback = (message) => {
    console.log(message);
}

const redis = new RedisPubSub();

(async () => {
    // const keyFuncList = [
    //     { key: KEYWORD.PUB_SAVE_NEWS, func: callback },
    //     { key: KEYWORD.PUB_SCORE_NEWS, func: callback }
    // ];
    // await redis.Subscribe(keyFuncList);
    await redis.Subscribe(ChannelFunctionList);
    SetChanFuncPublisher(redis);

    // const db1 = new TableNews();
    // await db1.flushTable();
    // const data1 = '{"T":"n","id":27091165,"headline":"Granite Wins $90M Construction Manager/General Contractor Project In Northern California","summary":"Granite (NYSE:GVA) announced today that it has been selected by the California Department of Transportation (Caltrans) as the Construction Manager/General Contractor (CM/GC) for the approximately $90 million State Route","author":"Benzinga Newsdesk","created_at":"2022-01-05T22:30:29Z","updated_at":"2022-01-05T22:30:30Z","url":"https://www.benzinga.com/news/22/01/24919710/granite-wins-90m-construction-managergeneral-contractor-project-in-northern-california","content":"\u003cp\u003eGranite (NYSE:...","symbols":["GVA"],"source":"benzinga"}';
    // const data2 = JSON.parse(data1);
    // const news = Util.WithoutProperty(data2, 'content');
    // await redis.Publish(KEYWORD.PUB_SAVE_NEWS, JSON.stringify(news));
})();

const url = "wss://stream.data.alpaca.markets/v1beta1/news";
const socket = new WebSocket(url);

const auth = { "action": "auth", "key": KEYWORD.API_KEY, "secret": KEYWORD.SECRET_KEY };
const subscribe = { "action": "subscribe", "news": ["*"] }


socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    const message = data[0]['msg'];

    if (message == 'connected') {
        console.log('do authentication');
        socket.send(JSON.stringify(auth));
    }

    if (message == 'authenticated') {
        console.log('do subscription');
        socket.send(JSON.stringify(subscribe));
    }

    for (var key in data) {
        console.log('index.js - ', key);
        console.log(data[key]);
        const type = data[key].T;
        if (type === 'n') {
            (async () => {
                const news = Util.WithoutProperty(data[key], 'content');
                await redis.Publish(KEYWORD.PUB_SAVE_NEWS, JSON.stringify(news));
            })();
        }

        //
        // const type = data[key].T;
        // if (type === 'n') {
        //     console.log('real time news');
        //     console.log(data[key]);
        // }
        //

    }
}
