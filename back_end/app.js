const express = require('express');
const session = require('express-session');
const LokiStore = require('connect-loki')(session);
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const nodemailer = require('nodemailer');

const DbFunctons = require('./utils/dbFunctionsNew');

function requiresAuth(req, res, next) {
  if (res.locals.logged) {
    next();
  } else {
    res.send({success: false, msg: 'Not logged in'});
  }
}

const app = express();

app.use(express.static('dist'));

app.use(session({
  cookie: {path: '/', httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7, sameSite: true},
  name: 'session-id',
  resave: false,
  saveUninitialized: true,
  secret: 'my secret',
  store: new LokiStore({})
}));

app.use((req, res, next) => {
  res.locals.logged = req.session.logged;
  res.locals.userId = req.session.userId;

  res.locals.manage = new DbFunctons(res.locals.logged, res.locals.userId);
  next();
});

app.use(express.json());

app.use(morgan('common'));

app.set('trust proxy', true)

app.post('/api/ping', (req, res) => {
  const { id } = req.body;

  let forceLogout = false;
  if (id !== res.locals.userId) forceLogout = true;

  res.send({success: true, forceLogout});
})

app.get('/api/example', (req, res) => {
  res.send({response: true});
});

app.post('/api/login', async (req, res) => {
  const {username, password} = req.body;

  const result = await res.locals.manage.signin(username, password);

  if (result.success) {
    req.session.logged = true;
    req.session.userId = result.details.id;
  }

  res.send(result);
});

app.post('/api/signout', requiresAuth, async (req, res) => {
  const {id} = req.body;
  let signedOut = false;

  if (await res.locals.manage.signout(id)) {
    delete req.body.logged;
    delete req.body.userId;

    signedOut = true;
  }

  res.send({success: signedOut});
  
});

app.post('/api/register', requiresAuth, async (req, res) => {
  const {username, email, password, geo, otp } = req.body;

  const result = await res.locals.manage.signup(username, email, password, geo, otp);

  res.send(result);
});

app.post('/api/letters', requiresAuth, async (req, res) => {
  const {method, id} = req.body;
  let result;
  if (method !== 'open') {
    result = await res.locals.manage.getLetters(id);
  } else {
    result = await res.locals.manage.getOpenLetters();
  }
  res.send(result);
});

app.post('/api/friends', requiresAuth, async (req, res) => {
  const {id} = req.body;
  
  const result = await res.locals.manage.getFriends();
  res.send(result);
});

app.post('/api/profile', requiresAuth, async (req, res) => {
  const {id} = req.body;

  const result = await res.locals.manage.getProfile(id);
  res.send(result);
});

app.post('/api/compose', requiresAuth, async (req, res) => {
  const {letterContent, letterLength, sourceId, targetId} = req.body;

  const distanceResult = await res.locals.manage.getDistance(targetId);

  if (distanceResult.success) {
    const result = await res.locals.manage.createLetter(targetId, letterContent, letterLength, distanceResult.distanceKm);

    res.send(result);
  } else {
    res.send(distanceResult);
  }
});

app.post('/api/estimate', requiresAuth, async (req, res) => {
  const { targetId } = req.body;

  const result = await res.locals.manage.getDistance(targetId);
  if (result.success) {
    const hours = Math.ceil(result.distanceKm / 60);
    res.send({success: true, hours});
  } else {
    res.send(result);
  }
});

app.post('/api/reject', requiresAuth, async (req, res) => {
  const {sourceId, targetId} = req.body;

  const result = await res.locals.manage.rejectUser(targetId);

  res.send(result);
});

app.post('/api/save', requiresAuth, async (req, res) => {
  const {changeStatus, profile} = req.body;

  const result = await res.locals.manage.saveChanges(changeStatus, profile);

  res.send(result);
});

app.post('/api/saveprivacy', requiresAuth, async (req, res) => {
  const {id, changeStatus, acceptingFriends, acceptingLetters, usersToRemove} = req.body;

  const result = await res.locals.manage.saveChangesPrivacy(changeStatus, acceptingFriends, acceptingLetters, usersToRemove);

  res.send(result);
});

app.post('/api/blockedlist', requiresAuth, async (req, res) => {
  const { id } = req.body;

  const result = await res.locals.manage.getBlockedUsers();

  res.send(result);
});

app.post('/api/block', requiresAuth, async (req, res) => {
  const { sourceId, targetId } = req.body;

  const result = await res.locals.manage.block(targetId);

  res.send(result);
});

app.post('/api/report', requiresAuth, async (req, res) => {
  const { sourceId, targetId, reportDetails } = req.body;

  const result = await res.locals.manage.report(targetId, reportDetails);

  res.send(result);
});

app.post('/api/deleteletter', requiresAuth, async (req, res) => {
  const { letterId } = req.body;

  const result = await res.locals.manage.deleteLetter(letterId);

  res.send(result);
});

app.post('/api/otp', async (req, res) => {
  const {email} = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.emailUser,
      pass: process.env.emailPassword
    }
  });

  const result = await res.locals.manage.generateOtp(email);

  if (result.success) {
    transporter.sendMail({
      from: 'Shuka',
      to: result.email,
      subject: 'Your email verify code',
      text: `Use code ${result.otpRaw} to complete your register for letter exchange. It's active for 5 minutes from now`
    });

    delete result.email;
    delete result.optRaw;
  } 

  res.send(result);
})

app.listen(5555, () => {
  console.log('started listening');
});
