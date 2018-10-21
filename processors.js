const EXCHANGES = require('./queues');
const tickerService = require('./tickers/ticker.service');

// const processorInitialisers = {
//   [EXCHANGES]: job => {
//     console.log('fetch prices');
//     tickerService.fetch();
//   }
// }

var _a;
var processorInitialisers = (_a = {},
    _a[EXCHANGES] = function (job) {
        console.log('fetch prices');
        tickerService.fetch();
    },
    _a);


module.exports = {
    processorInitialisers
}