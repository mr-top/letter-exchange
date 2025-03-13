const express = require('express');
const session = require('express-session');
const LokiStore = require('connect-loki')(session);
const morgan = require('morgan');
const cors = require('cors');

const dbFunctons = require('./utils/dbFunctions');

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
  next();
});

app.use(express.json());

app.use(morgan('common'));

app.set('trust proxy', true)

app.get('/example', (req, res) => {
  res.send({response: true});
});

app.get('/session', (req, res) => {
  let accessCount = Number(req.session.accessCount) || 0;
  accessCount++;

  req.session.accessCount = accessCount;

  res.send({accessCount});
});

app.post('/ping', async (req, res) => {
  const { id } = req.body;
  const result = await dbFunctons.ping(id);

  res.send(result);
});

app.post('/login', async (req, res) => {
  const {username, password} = req.body;

  const result = await dbFunctons.login(username, password);

  if (result.success) {
    req.session.logged = true;
    req.session.userId = result.id;
  }

  res.send(result);
});

app.post('/signout', requiresAuth, (req, res) => {
  const {id} = req.body;

  delete req.body.logged;
  delete req.body.userId;
  res.send({success: true});
});

app.post('/register', requiresAuth, async (req, res) => {
  const {username, email, password, geo} = req.body;

  const result = await dbFunctons.register(username, email, password, geo);

  res.send(result);
});

app.post('/letters', requiresAuth, async (req, res) => {
  const {method, id} = req.body;
  let result;
  if (method !== 'open') {
    result = await dbFunctons.getLetters(res.locals.userId, id);
  } else {
    result = await dbFunctons.getOpenletters(id);
  }
  res.send(result);
});

app.post('/friends', requiresAuth, async (req, res) => {
  const {id} = req.body;
  
  const result = await dbFunctons.getFriends(id);
  res.send(result);
});

app.post('/profile', requiresAuth, async (req, res) => {
  const {id} = req.body;

  const result = await dbFunctons.getProfile(id);
  res.send(result);
});

app.post('/compose', requiresAuth, async (req, res) => {
  const {letterContent, letterLength, sourceId, targetId} = req.body;

  const distanceResult = await dbFunctons.getDistance(sourceId, targetId);

  if (distanceResult.success) {
    const result = await dbFunctons.createLetter(sourceId, targetId, letterContent, letterLength, distanceResult.distanceKm);

    res.send(result);
  } else {
    res.send(distanceResult);
  }
});

app.post('/estimate', requiresAuth, async (req, res) => {
  const { sourceId, targetId } = req.body;

  const result = await dbFunctons.getDistance(sourceId, targetId);
  if (result.success) {
    const hours = Math.ceil(result.distanceKm / 60);
    res.send({success: true, hours});
  } else {
    res.send(result);
  }
});

app.post('/reject', requiresAuth, async (req, res) => {
  const {sourceId, targetId} = req.body;

  const result = await dbFunctons.rejectUser(sourceId, targetId);

  res.send(result);
});

app.listen(5555, () => {
  console.log('started listening');
});