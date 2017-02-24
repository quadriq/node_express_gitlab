'use strict'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var config = require('./config.json');

var fs = require("fs");
var express = require("express");
var passport = require("passport");
var session = require('express-session');
var cookieParser = require('cookie-parser');

var app = express();

app.use(cookieParser());
app.use(session({
  secret: 'clinksecret', // TODO: STORE outside
  saveUninitialized: true,
  resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

var GitlabStrategy = require('passport-gitlab2').Strategy;

passport.use(new GitlabStrategy({
    clientID: config.clientID,
    clientSecret: config.clientSecret,
    callbackURL: config.callbackURL,
    baseURL: config.baseURL
  },
  function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
  }
));

app.use(/^\/(?!oauth|assets).*/, function(req, res, next) {
  if (req.user == null) {
    console.log("doing redirect as not login");
    res.redirect('/oauth/login');
    return;
  }
  console.log("user logged in");
  next()
});
app.use(express.static(__dirname + '/public'));


app.use('/oauth/login', express.static(__dirname + '/views/login.html'));

app.get('/oauth/logout', function(req, res) {
  req.session.destroy();
  res.redirect('/');
});

app.get('/oauth/gitlab', passport.authenticate('gitlab'));

app.get('/oauth/callback', passport.authenticate('gitlab', {
  successRedirect: '/',
  failureRedirect: '/oauth/login'
}));

app.get('/oauth/user', function(req, res) {
  console.log(JSON.stringify(req.user));
  res.send(JSON.stringify(req.user));
});

app.listen(3000, "0.0.0.0");
'use strict'
