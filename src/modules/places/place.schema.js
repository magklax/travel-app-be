const { Schema, model } = require('mongoose');

const placeLocaleSchema = new Schema({
  _id: false,
  lang: {
    type: String,
    required: true,
  },
  name: String,
  description: String,
});

const RateSchema = new Schema({
  _id: false,
  name: String,
  rate: Number,
});

const placeSchema = new Schema({
  countryId: {
    type: Schema.Types.ObjectId,
    require: true,
  },
  imageUrl: {
    type: String,
    require: true,
  },
  rates: [RateSchema],
  localizations: [placeLocaleSchema],
});

const Place = model('Place', placeSchema);

module.exports = Place;
