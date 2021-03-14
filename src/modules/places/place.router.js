const express = require('express');
const wrap = require('../../common/errors/async-error-wrapper');
const placeService = require('./place.service');
const validateId = require('../../common/validation/objectID.validation');
const { DEFAULT_LANG } = require('../../common/config');
const { ENTITY_NAME } = require('./constants');

const router = express.Router();

router.param(
  'id',
  wrap(async (req, _, next) => {
    const { id } = req.params;
    validateId(id, ENTITY_NAME);
    next();
  })
);

router.get(
  '/',
  wrap(async (req, res) => {
    const lang = req.query.lang || DEFAULT_LANG;
    const data = await placeService.getAll(lang);
    res.send(data);
  })
);

router.get(
  '/:id',
  wrap(async (req, res) => {
    const lang = req.query.lang || DEFAULT_LANG;
    const { id } = req.params;
    const data = await placeService.getOne(id, lang);
    res.json(data);
  })
);

router.post(
  '/:id',
  wrap(async (req, res) => {
    const { id } = req.params;
    const data = await placeService.updateRates(id, req.body);
    res.json(data);
  })
);

module.exports = router;
