const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let TwitModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (tweeter) => _.escape(tweeter).trim();

const TwitSchema = new mongoose.Schema({
  tweet: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdData: {
    type: Date,
    default: Date.now,
  },
});

TwitSchema.statics.toAPI = (doc) => ({
  tweet: doc.tweet,
  username: doc.username,
  createdData: doc.createdData,
});

TwitSchema.statics.findAll = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };
  if (!search) {
    return null;
  } // blank for now

  return TwitModel.find({}).select('tweet username createdDate').exec(callback);
};

TwitSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return TwitModel.find(search).select('tweet username createdDate').exec(callback);
};

TwitModel = mongoose.model('Twit', TwitSchema);

module.exports.TwitModel = TwitModel;
module.exports.TwitSchema = TwitSchema;

// twitModel.find({})
