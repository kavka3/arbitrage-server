const express = require('express');
const router = express.Router();
const tickerService = require('./ticker.service');

// routes
router.get('/', getAll);
router.get('/:symbol', getBySymbol);
router.post('/fetch', fetch);
// router.post('/create', create);
// router.get('/price/:symbol', getPriceBySymbol);

module.exports = router;

function getAll(req, res, next) {
    tickerService.getAll()
        .then(tickers => res.json(tickers))
        .catch(err => next(err));
}

function getBySymbol(req, res, next) {

    console.log("getBySymbol: ",req.params.symbol)

    tickerService.getBySymbol(req.params.symbol)
        .then(tickers => tickers ? res.json(tickers) : res.sendStatus(404))
        .catch(err => next(err));
}

// function create(req, res, next) {
//     tickerService.create(req.body)
//         .then(() => res.json({}))
//         .catch(err => next(err));
// }

function fetch(req, res, next) {
    tickerService.fetch()
        .then(tickers => res.json(tickers))
        .catch(err => next(err));
}

// function getPriceBySymbol(req, res, next) {
//     tickerService.getPriceBySymbol(req.params.symbol)
//         .then(ticker => res.json(ticker))
//         .catch(err => next(err));
// }