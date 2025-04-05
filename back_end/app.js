const express = require('express');
const session = require('express-session');
const LokiStore = require('connect-loki')(session);
const morgan = require('morgan');
const cors = require('cors');

const DbFunctons = require('./utils/dbFunctionsNew');

function requiresAuth(req, res, next) {
  if (res.locals.logged) {
    next();
  } else {
    res.send({success: false, msg: 'Not logged in'});
  }
}

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true
}));

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

app.post('/ping', (req, res) => {
  const { id } = req.body;

  let forceLogout = false;
  if (id !== res.locals.userId) forceLogout = true;

  res.send({success: true, forceLogout});
})

app.get('/example', (req, res) => {
  res.send({response: true});
});

app.post('/login', async (req, res) => {
  const {username, password} = req.body;

  const result = await res.locals.manage.signin(username, password);

  if (result.success) {
    req.session.logged = true;
    req.session.userId = result.details.id;
  }

  res.send(result);
});

app.post('/signout', requiresAuth, async (req, res) => {
  const {id} = req.body;
  let signedOut = false;

  if (await res.locals.manage.signout(id)) {
    delete req.body.logged;
    delete req.body.userId;

    signedOut = true;
  }

  res.send({success: signedOut});
  
});

app.post('/register', requiresAuth, async (req, res) => {
  const {username, email, password, geo} = req.body;

  const result = await res.locals.manage.signup(username, email, password, geo);

  res.send(result);
});

app.post('/letters', requiresAuth, async (req, res) => {
  const {method, id} = req.body;
  let result;
  if (method !== 'open') {
    result = await res.locals.manage.getLetters(id);
  } else {
    result = await res.locals.manage.getOpenLetters();
  }
  res.send(result);
});

app.post('/friends', requiresAuth, async (req, res) => {
  const {id} = req.body;
  
  const result = await res.locals.manage.getFriends();
  res.send(result);
});

app.post('/profile', requiresAuth, async (req, res) => {
  const {id} = req.body;

  const result = await res.locals.manage.getProfile(id);
  res.send(result);
});

app.post('/compose', requiresAuth, async (req, res) => {
  const {letterContent, letterLength, sourceId, targetId} = req.body;

  const distanceResult = await res.locals.manage.getDistance(targetId);

  if (distanceResult.success) {
    const result = await res.locals.manage.createLetter(targetId, letterContent, letterLength, distanceResult.distanceKm);

    res.send(result);
  } else {
    res.send(distanceResult);
  }
});

app.post('/estimate', requiresAuth, async (req, res) => {
  const { targetId } = req.body;

  const result = await res.locals.manage.getDistance(targetId);
  if (result.success) {
    const hours = Math.ceil(result.distanceKm / 60);
    res.send({success: true, hours});
  } else {
    res.send(result);
  }
});

app.post('/reject', requiresAuth, async (req, res) => {
  const {sourceId, targetId} = req.body;

  const result = await res.locals.manage.rejectUser(targetId);

  res.send(result);
});

app.post('/save', requiresAuth, async (req, res) => {
  const {changeStatus, profile} = req.body;

  const result = await res.locals.manage.saveChanges(changeStatus, profile);

  res.send(result);
});

app.post('/saveprivacy', requiresAuth, async (req, res) => {
  const {id, changeStatus, acceptingFriends, acceptingLetters, usersToRemove} = req.body;

  const result = await res.locals.manage.saveChangesPrivacy(changeStatus, acceptingFriends, acceptingLetters, usersToRemove);

  res.send(result);
});

app.post('/blockedlist', requiresAuth, async (req, res) => {
  const { id } = req.body;

  const result = await res.locals.manage.getBlockedUsers();

  res.send(result);
});

app.post('/block', requiresAuth, async (req, res) => {
  const { sourceId, targetId } = req.body;

  const result = await res.locals.manage.block(targetId);

  res.send(result);
});

app.post('/report', requiresAuth, async (req, res) => {
  const { sourceId, targetId, reportDetails } = req.body;

  const result = await res.locals.manage.report(targetId, reportDetails);

  res.send(result);
});

app.listen(5555, () => {
  console.log('started listening');
});