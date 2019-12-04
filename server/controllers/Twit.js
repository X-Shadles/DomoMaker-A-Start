const models = require('../models');
const Twit = models.Twit;

const makerPage = (req, res) => {
  Twit.TwitModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'an error occured' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), twits: docs });
  });
};

const publicPage = (req, res) => {
  Twit.TwitModel.find((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'an error occured' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), twits: docs });
  });
};

const makeTwit = (req, res) => {
  if (!req.body.tweet) {
    return res.status(400).json({ error: 'You must enter some text' });
  }

  const twitData = {
    tweet: req.body.tweet,
    username: req.session.account.username,
    owner: req.session.account._id,
  };

  const newTwit = new Twit.TwitModel(twitData);

  const twitPromise = newTwit.save();

  twitPromise.then(() => res.json({ redirect: '/maker' }));

  twitPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Tweet already exists' });
    }

    return res.status(400).json({ error: 'RAWR! Dont do that!' });
  });

  return twitPromise;
};

const getTwits = (request, response) => {
  const req = request;
  const res = response;

  return Twit.TwitModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'an error occurred' });
    }

    return res.json({ twits: docs });
  });
};


module.exports.makerPage = makerPage;
module.exports.publicPage = publicPage;
module.exports.make = makeTwit;
module.exports.getTwits = getTwits;
