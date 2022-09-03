const { createClient } = require('redis');

class RedisPubSub {
    constructor() {
        this.publisher = null;
    }

    async Connect() {
        const client = createClient();
        client.on('error', (err) => console.log('Redis Client Error', err));
        await client.connect({
            host: 'localhost',
            port: 6379
        });
        this.publisher = client;
    }

    async Subscribe(keyFuncList) {
        const client = createClient();
        client.on('error', (err) => console.log('Redis Client Error', err));
        await client.connect({
            host: 'localhost',
            port: 6379
        });

        const subscriber = client.duplicate();

        await subscriber.connect();

        for (let ix = 0; ix < keyFuncList.length; ++ix) {
            const row = keyFuncList[ix];
            await subscriber.subscribe(row.key, row.func);
        }
        this.publisher = client;
    }

    async Publish(channel, message) {
        if (this.publisher !== null) {
            await this.publisher.publish(channel, message);
        }
    }

}

module.exports = RedisPubSub;

// const client = createClient();

// const pubsub = async (client) => {
//     client.on('error', (err) => console.log('Redis Client Error', err));
//     await client.connect();

//     const subscriber = client.duplicate();

//     await subscriber.connect();

//     await subscriber.subscribe('channel1', (message) => {
//         console.log(message); // 'message'
//     });

//     await subscriber.subscribe('channel2', (message) => {
//         console.log(message); // 'message'
//     });
// }

// pubsub(client).then(() => {
//     client.publish('channel1', 'hello there');
//     client.publish('channel2', 'hey you');
// });

// const callback = (message) => {
//     console.log(message);
// }

// const app = new RedisPubSub();
// (async () => {
//     await app.Subscribe([{ key: 'channel1', func: callback }]);
//     await app.Publish('channel1', 'hello you');
//     await app.Publish('channel1', 'but what');
// })();
