const express = require('express');
const wrap = require('../../common/errors/async-error-wrapper');
const placeService = require('./place.service');
const validateId = require('../../common/validation/objectID.validation');
const { DEFAULT_LANG } = require('../../common/config');
const { ENTITY_NAME } = require('./constants');
const Place = require('./place.schema');

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

    const query = { _id: id, 'rates.name': req.body.name };
    const options = { new: true };
    const callback = (errs, docs) => {
      if (errs) {
        return res.status(400).json({ errors: errs });
      } else {
        return res.status(200).json({ errors: docs });
      }
    };

    await Place.findOne(query, (_, docs) => {
      if (!docs) {
        Place.findByIdAndUpdate(
          id,
          { $push: { rates: req.body } },
          options,
          callback
        );
      } else if (docs) {
        Place.findOneAndUpdate(
          query,
          {
            $set: {
              'rates.$.name': req.body.name,
              'rates.$.rate': req.body.rate,
            },
          },
          options,
          callback
        );
      }
    });
  })
);

module.exports = router;
