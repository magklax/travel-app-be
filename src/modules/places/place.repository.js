const Place = require('./place.schema');
const { NotFoundError } = require('../../common/errors/errors-list');
const { ENTITY_NAME } = require('./constants');
const { Types } = require('mongoose');

const placeExcludedFields = { _id: 0, __v: 0, lang: 0, countryId: 0 };

const getAllByLang = async (lang) => {
  return await Place.aggregate()
    .match({ localizations: { $elemMatch: { lang } } })
    .unwind('localizations')
    .match({ 'localizations.lang': lang })
    .replaceRoot({
      $mergeObjects: [{ id: '$_id' }, '$localizations', '$$ROOT'],
    })
    .project(placeExcludedFields);
};

const getOneByLang = async (id, lang) => {
  const data = await Place.aggregate()
    .match({ _id: Types.ObjectId(id) })
    .unwind('localizations')
    .match({ 'localizations.lang': lang })
    .replaceRoot({
      $mergeObjects: [{ id: '$_id' }, '$localizations', '$$ROOT'],
    })
    .project(placeExcludedFields);

  const place = data[0];
  if (place) {
    return place;
  }
  throw new NotFoundError(ENTITY_NAME);
};

const updateRates = async (id, data) => {
  const query = { _id: id, 'rates.name': data.name };
  const options = { new: true };

  const result = await Place.exists(query);

  if (!result) {
    return Place.findByIdAndUpdate(
      id,
      { $push: { rates: data } },
      options
    ).exec();
  } else {
    return Place.findOneAndUpdate(
      query,
      {
        $set: {
          'rates.$.name': data.name,
          'rates.$.rate': data.rate,
        },
      },
      options
    ).exec();
  }
};

module.exports = {
  getAllByLang,
  getOneByLang,
  updateRates,
};
