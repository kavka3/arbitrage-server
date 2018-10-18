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
    return {
        host: redisConfig.hostname || 'localhost',
        port: Number(redisConfig.port || 6379),
        database: (redisConfig.pathname || '/0').substr(1) || '0',
        password: redisConfig.auth ? redisConfig.auth.split(':')[1] : undefined
    };
}

prdsMonQueue = new Queue('test',
    {
        limiter: {
            max: 1000, // not work even 1000
            duration: 10
        }
    }
)

const monitoring = async (product) => {
    console.log('done', product)
    return product
}
prdsMonQueue.on('completed', async function (job, result) {
    console.log('run', result)
})
const addJob = function (product) {
    let uid = uuid.v1()
    prdsMonQueue.process(uid, function (job) {
        return monitoring(job.data)
    })
    prdsMonQueue.add(uid, product, {
        repeat: {
            cron: `*/5 * * * * *`
        }
    })
}

const products = ['A', 'B', 'C', 'D']
for (let i = 0; i < products.length; i++) {
    addJob(products[i])
}


app.use('/', Arena(
    {
        queues: [
            {
                name: 'test',
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


var listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Server started PORT', + listener.address().port);
});