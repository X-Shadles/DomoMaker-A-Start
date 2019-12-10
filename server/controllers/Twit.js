const models = require('../models');
const Twit = models.Twit;

//page to display every tweet
const publicPage = (req, res) => {
  Twit.TwitModel.findAll(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'an error occured' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), twits: docs });
  });
};

//page to show personal tweets
const homePage = (req, res) => {
  Twit.TwitModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'an error occured' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), twits: docs });
  });
};

//format the time to make it look good
function formatTime(date) {
  const monthNames = [
    'January', 'February', 'March',
    'April', 'May', 'June', 'July',
    'August', 'September', 'October',
    'November', 'December',
  ];

  let clock;
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();
  let hours = date.getHours();
  let min = date.getMinutes();

  if (min === 0 || min === '0') {
    min = '00';
  }
  if (hours > 12) {
    hours -= 12;
    clock = `${hours}:${min} PM`;
  } else {
    clock = `${hours}:${min} AM`;
  }

  return `${monthNames[monthIndex]}/${day}/${year} ${clock} UTC`;
}

//make a tweet and accept data
const makeTwit = (req, res) => {
  if (!req.body.tweet) {
    return res.status(400).json({ error: 'You must enter some text' });
  }
  const currentDate = formatTime(new Date());
  const twitData = {
    tweet: req.body.tweet,
    username: req.session.account.username,
    owner: req.session.account._id,
    createdDate: currentDate,
  };

  const newTwit = new Twit.TwitModel(twitData);

  const twitPromise = newTwit.save();

  twitPromise.then(() => res.json({ redirect: '/maker' }));

  twitPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Tweet already exists' });
    }

    return res.status(400).json({ error: 'Tweet, Dont do that!' });
  });

  return twitPromise;
};

//get all the tweets
const getTwits = (request, response) => {
  const req = request;
  const res = response;

  return Twit.TwitModel.findAll(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'an error occurred' });
    }

    return res.json({ twits: docs });
  });
};

//just get the personal tweets (needs to be seprate to be called from diff buttons)
const getHome = (request, response) => {
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


module.exports.publicPage = publicPage;
module.exports.homePage = homePage;
module.exports.make = makeTwit;
module.exports.getTwits = getTwits;
module.exports.getHome = getHome;
