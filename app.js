const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const errorHandler = require('./_helpers/error-handler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// api routes
app.use('/tickers', require('./tickers/ticker.controller'));

// global error handler
app.use(errorHandler);

var listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Server started ', + listener.address().port);
});