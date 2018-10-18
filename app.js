const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const Queue = require('bull');
const Arena = require('bull-arena')
const url = require('url')
const uuid = require('uuid');

const app = express();
const errorHandler = require('./_helpers/error-handler');

const redisClient = require('./redis-client');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// api routes
app.use('/tickers', require('./tickers/ticker.controller'));

// global error handler
app.use(errorHandler);

function getRedisConfig(redisUrl) {
    const redisConfig = url.parse(redisUrl);
    console.log(redisConfig);
    return {
        host: 'sadadasdad/asdasd',
        port: Number(redisConfig.port || 6379),
        database: (redisConfig.pathname || '/0').substr(1) || '0',
        password: redisConfig.auth ? redisConfig.auth.split(':')[1] : undefined
    };
}

app.use('/', Arena(
    {
        queues: [
            {
                name: 'test - queue',
                hostId: 'Worker',
                redis: getRedisConfig(process.env.REDIS_URL)
            }
        ]
    },
    {
        basePath: '/arena',
        disableListen: true
    }
));

var testQueue = new Queue('test queue', 'redis://redis:6379');

testQueue.process(function (job) {
    // Check payments

    console.log("RIKIBKAKA");

});

testQueue.add({}, { repeat: { cron: '15 3 * * *' } });

var listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Server started PORT', + listener.address().port);
});