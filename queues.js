const Queue = require('bull');

const EXCHANGES = 'EXCHANGES';

// const queues = {
//   [EXCHANGES]: new Queue(
//     EXCHANGES,
//     process.env.REDIS_URL
//   )
// };

var _a;
var queues = (_a = {},
    _a[EXCHANGES] = new Queue(EXCHANGES, process.env.REDIS_URL),
    _a);


module.exports = {
    EXCHANGES,
    queues
};