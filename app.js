const express = require('express');
const path = require('path');
const logger = require('morgan');
const swaggerUi = require('swagger-ui-express');

// Import routers
const indexRouter = require('./routes/index');
const weatherRouter = require('./routes/weather');

const app = express();
const swaggerDocument = require('./swagger.json');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve Swagger & API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/', indexRouter);
app.use('/weather', weatherRouter);

module.exports = app;
