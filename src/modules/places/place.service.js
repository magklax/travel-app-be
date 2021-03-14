const placeRepo = require('./place.repository');

const getAll = async (lang) => {
  const places = await placeRepo.getAllByLang(lang);
  return places;
};

const getOne = async (id, lang) => {
  const place = await placeRepo.getOneByLang(id, lang);
  return place;
};

const updateRates = async (id, data) => {
  const rates = await placeRepo.updateRates(id, data);
  return rates;
};

module.exports = {
  getAll,
  getOne,
  updateRates,
};
