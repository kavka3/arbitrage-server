const tickerService = require('./tickers/ticker.service');

const Queue = require('bull');

var EXCHANGES = new Queue('EXCHANGES', 'redis://redis:6379');

EXCHANGES.process(function (job, done) {

    tickerService.fetch()
    done();

    // or give a error if error
    // done(new Error('error transcoding'));

    // or pass it a result
    // done(null, { framerate: 29.5 /* etc... */ });

    // If the job throws an unhandled exception it is also handled correctly
    throw new Error('some unexpected error');
});

EXCHANGES.on('completed', job => {
    console.log(`Job with id ${job.id} has been completed`);
})

EXCHANGES.add(
    {},
    {
        repeat: {
            every: 20000
            //   limit: 100
        }
    }
);

// crypto_prices_queue.add({}, { repeat: { cron: '* * * * *' } });

// const queues = require('./queues');
// const processorInitialisers = require('./processors');

// Object.entries(queues).forEach(([queueName, queue]) => {
//   console.log(`Worker listening to '${queueName}' queue`);
//   queue.process(processorInitialisers[queueName]);
// });

// Object.entries(queues).forEach(function (_a) {
//     var queueName = _a[0], queue = _a[1];
//     console.log("Worker listening to '" + queueName + "' queue");
//     queue.process(processorInitialisers[queueName]);
// });