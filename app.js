require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');

const session = require('express-session');

// import passport docs from config folder
const passportSetup =  require('./config/passport/passport-setup');


// add CORS to handle cross-origin communication between your two apps:
const cors          = require("cors");

mongoose
// .connect('mongodb://localhost/phones-backend', {useNewUrlParser: true})
  .connect(process.env.MONGODB_URI, {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';


// Allow Cross-Origin Resource Sharing (CORS)
// (allows access to the API from the frontend JS on a different domain/origin)
app.use(cors({
  // allow other domains/origins to send cookies
  credentials: true,
  // the array of domains/origins we want cookies from (just the React app)
  origin: [ "http://localhost:3000" ]
}));


// handle session here:
// app.js
app.use(session({
  // secret: "some super secret goes here",
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));

// 🎯🎯🎯 MUST come after the session: 🎯🎯🎯
passportSetup(app);


// ROUTES MIDDLEWARE:

const index = require('./routes/index');
app.use('/', index);

app.use('/api', require("./routes/auth-routes.js"));


module.exports = app;
