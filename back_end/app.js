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
  res.locals.usedId = req.session.userId;
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

app.post('/login', async (req, res) => {
  const {username, password} = req.body;

  const result = await dbFunctons.login(username, password);

  if (result.success) {
    req.session.logged = true;
    req.session.userId = result.id;
  }

  res.send(result);
});

app.post('/signout', (req, res) => {
  const {id} = req.body;

  delete req.body.logged;
  delete req.body.userId;
  res.send({success: true});
});

app.post('/register', requiresAuth, async (req, res) => {
  const {username, email, password, geo} = req.body;

  const result = await dbFunctons.register(username, email, password, geo.countryCode);

  res.send(result);
})

app.listen(5555, () => {
  console.log('started listening');
});