const axios = require('axios');
const db = require('../_helpers/db');
const Sentry = require('@sentry/node');
Sentry.init({ dsn: 'https://b95faf4c640f4b70be2f4c41e1212b41@sentry.io/1305664' });

const Ticker = db.Ticker;

module.exports = {
    getAll,
    getBySymbol,
    fetch
};

async function getAll() {
    return await Ticker.find().select('symbol exchange price updateDate');
}

async function getBySymbol(symbol) {
    return await Ticker.find({ symbol: symbol.toUpperCase() }).select('symbol exchange price updateDate');;
}

async function fetch() {
    await getBinancePrices();
    await getBittrexPrices();
    await getPoloniexPrices();

    // try {
    //     aFunctionThatMightFail();
    // } catch (err) {
    //     Sentry.captureException(err);
    // }
    // return await getBitfinexPrices();
}

var count2 = 0;
var count1 = 0;
var count3 = 0;

function getBinancePrices() {
    return new Promise(resolve => {
        axios.get('https://api.binance.com/api/v3/ticker/price')
            .then(response => {
                console.log("#" + ++count1 + " - Binance response status: " + response.status);
                response.data.forEach(ticker => {
                    handleTicker({ symbol: ticker.symbol, exchangeSymbol: ticker.symbol, price: ticker.price, exchange: "binance" });
                });

                resolve(response.data);
            })
            .catch(error => {
                console.log(error);
                resolve(error);
            });
    });
}

function getBittrexPrices() {
    return new Promise(resolve => {
        axios.get('https://bittrex.com/api/v1.1/public/getmarketsummaries')
            .then(response => {
                console.log("#" + ++count3 + " - Bittrex response status: " + response.status);
                // console.log("Bittrex symbols " + response.data.result.length);
                response.data.result.forEach(ticker => {
                    handleTicker({ symbol: formatSymbol(ticker.MarketName, '-'), exchangeSymbol: ticker.MarketName, price: ticker.Last, exchange: "bittrex" });
                });
                resolve(response.data.result);
            })
            .catch(error => {
                console.log(error);
                resolve(error);
            });
    });
}

function getPoloniexPrices() {
    return new Promise(resolve => {
        axios.get('https://poloniex.com/public?command=returnTicker')
            .then(response => {
                var count = 0;

                console.log("#" + ++count2 + " - Poloniex response status: " + response.status);

                Object.keys(response.data).forEach(key => {
                    handleTicker({ symbol: formatSymbol(key, '_'), exchangeSymbol: key, price: response.data[key].last, exchange: "poloniex" });
                    count++;
                });



                // console.log("Poloniex symbols: " + count);
                resolve(response.data);
            })
            .catch(error => {
                console.log(error);
                resolve(error);
            });
    });
}

function formatSymbol(symbol, delimeter) {
    var pos = symbol.indexOf(delimeter);
    var res1 = symbol.slice(0, pos);
    var res2 = symbol.slice(pos + 1);
    return res2 + res1;
}

// function getBitfinexPrices() {
//     return new Promise(resolve => {
//         axios.get('https://api.bitfinex.com/v1/symbols')
//             .then(response => {

//                 response.data.forEach(tickerSymbol => {
//                     axios.get('https://api.bitfinex.com/v1/pubticker/' + tickerSymbol)
//                         .then(response => {
//                             // console.log(response.data);
//                             handleTicker({ symbol: tickerSymbol, price: response.data.last_price, exchange: "bitfinex" });
//                         })
//                         .catch(error => {
//                             console.log(error);
//                             resolve(error);
//                         });
//                 });

//                 // resolve(response.data);
//             })
//             .catch(error => {
//                 console.log(error);
//                 resolve(error);
//             });
//     });
// }


async function handleTicker(tickerObject) {

    Ticker.findOneAndUpdate({ symbol: tickerObject.symbol, exchange: tickerObject.exchange },
        { price: tickerObject.price, exchangeSymbol: tickerObject.exchangeSymbol, "$currentDate": { "updateDate": true } },
        { new: true, upsert: true, setDefaultsOnInsert: true },
        function (err, ticker) {
            if (err) return console.error(err);
            // console.log(ticker);
            // if (!ticker) {
            //     const newTicker = new Ticker(tickerObject);
            //     newTicker.save(function (err, ticker) {
            //         if (err) return console.error(err);
            //         console.log(ticker);
            //     });
            // } else {
            //     console.log(ticker);
            // }
        });

}