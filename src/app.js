require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const countryRouter = require('./modules/countries/country.router');
const placeRouter = require('./modules/places/place.router');

const { StatusCodes, ReasonPhrases } = require('http-status-codes');

const errorMiddleware = require('./middleware/error-middleware');
const requestLogMiddleware = require('./middleware/request-logger');

const app = express();
const swaggerDoc = YAML.load(path.join(__dirname, './docs/doc.yaml'));

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use(requestLogMiddleware);

app.use('/favicon.ico', (_, res) => res.sendStatus(StatusCodes.NO_CONTENT));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Routers

app.use('/countries', countryRouter);
app.use('/places', placeRouter);

app.use((_, res) => {
  res.status(StatusCodes.NOT_IMPLEMENTED).send(ReasonPhrases.NOT_IMPLEMENTED);
});

app.use(errorMiddleware);

module.exports = app;
