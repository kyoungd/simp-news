const { SubscribePostNews } = require('../src/pubsub/sub-post-news.js');
const { KEYWORD } = require('../src/constants.js');

(async () => {
    const postNews = SubscribePostNews.instance;
    url = KEYWORD.POST_NEWS_URL;
    token = KEYWORD.POST_NEWS_SYSOP_TOKEN.jwt;
    message = `{"T": "n", "id": 28037396, "headline": "JMP Securities Maintains Market Outperform Rating for KKR &amp; Co: Here&#39;s What You Need To Know", "summary": "JMP Securities has decided to maintain its Market Outperform rating of KKR &amp; Co (NYSE:KKR) and lower its price target from $85.00 to $80.00. Shares of KKR &amp; Co are trading up 1.58% over the last 24 hours, at $48.02 per share.", "author": "Benzinga Insights", "created_at": "2022-07-12T16:19:29Z", "updated_at": "2022-07-12T16:19:30Z", "url": "https://www.benzinga.com/analyst-ratings/22/07/28037396/jmp-securities-maintains-market-outperform-rating-for-kkr-co-heres-what-you-need-to-know", "symbols": ["KKR"], "source": "benzinga", "sentiment": 0.50639187545 }`;
    const result = await postNews.PostData(url, token, message);
    console.log(result);
})();


// const findGraph = (edges) => {
//     const graph = new Map();
//     for (let [src, dst] of edges) {
//         if (!graph.has(src)) graph.set(src, []);
//         graph.get(src).push(dst);
//         if (!graph.has(dst)) graph.set(dst, []);
//         graph.get(dst).push(src);
//     }
//     return graph;
// }

// const edges = [
//     ['1', '2'],
//     ['4', '6'],
//     ['5', '6'],
//     ['7', '6'],
//     ['8', '6'],
//     ['3', '7']
// ];
// const graph = findGraph(edges);


// const dft = (graph, visited, src, dst) => {
//     if (visited[src]) return false;
//     visited[src] = true;
//     if (src === dst) return true;
//     for (let node of graph.get(src)) {
//         if (dft(graph, visited, node, dst)) return true;
//     }
//     return false;
// }

// const edges = [
//     ['i', 'j'],
//     ['k', 'i'],
//     ['m', 'k'],
//     ['k', 'l'],
//     ['o', 'n']
// ];

// const graph = findGraph(edges);
// const visited = new Set();
// console.log(dft(graph, visited, 'i', 'm'));




// const dft = (graph, src, dst) => {
//     if (src === dst) return true;
//     for (let node of graph[src]) {
//         if (dft(graph, node, dst)) return true;
//     }
//     return false;
// }

// const graph = {
//     'a': ['b', 'c'],
//     'b': ['d'],
//     'c': ['e'],
//     'd': [],
//     'e': ['b'],
//     'f': ['d']
// }

// console.log(dft(graph, 'a', 'd'));



// class Queue {
//     constructor() {
//         this.data = [];
//     }

//     enqueue(item) {
//         this.data.push(item);
//     }

//     dequeue() {
//         return this.data.shift();
//     }
// }

// const bft = (graph, src, dst) => {
//     const queue = new Queue();
//     queue.enqueue(src);
//     while (queue.data.length) {
//         const node = queue.dequeue();
//         if (node === dst) return true;
//         for (let child of graph[node])
//             queue.enqueue(child);
//     }
//     return false;
// }

// console.log(bft(graph, 'a', 'f'));


