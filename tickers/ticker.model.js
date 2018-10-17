const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    symbol: { type: String, required: true, max: 10 },
    exchangeSymbol: { type: String, max: 20 },
    exchange: { type: String, required: true, max: 20 },
    price: { type: Number, default: 0 },
    createdDate: { type: Date, default: Date.now },
    updateDate: { type: Date, default: Date.now }
});

// schema.set('toJSON', { virtuals: true });
schema.index({ symbol: 1, exchange: 1 }, { unique: true });

module.exports = mongoose.model('Ticker', schema);