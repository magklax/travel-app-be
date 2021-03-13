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

module.exports = {
  getAllByLang,
  getOneByLang,
};
