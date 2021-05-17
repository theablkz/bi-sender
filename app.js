const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors')
const axios = require('axios')
const createError = require('http-errors');
const url = require('url');
const fetch = require("node-fetch");
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const proxy = require('express-http-proxy');
const bodyParser = require('body-parser');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(cors())
app.use(logger('dev'));
app.use(bodyParser.urlencoded());

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// const headers = {
//   'Authorization': 'c2l0ZTpASiNeeVFGcEQwaSp4OGJNbSU=',
//   'Content-Type': 'application/json',
//   'Postman-Token': '8d76458f-fa48-4de3-a380-b293852b2cdb,1f79bc31-0082-4e64-8d91-4ac011a1be04,abba4b84-5c99-4449-8e1d-dbcb8c67792e',
//   'cache-control': 'no-cache'
// }


app.get('/', async (req, res) => {
  try {
    await axios.get('https://apigw.bi.group/sales-crm/integration/siteApplications', {
      headers: {
        'Authorization': req.headers['authorization'],
        'Content-Type': req.headers['content-type'],
        'Postman-Token': req.headers['postman-token'],
        'cache-control': req.headers['cache-control']
      },
      params: { ...req.query }
    }).then(response => {
      res.send(response.data)
    }).catch(err => {
      console.log('response error',err)
      res.send(err)
    })
  } catch (e) {
    res.send(e)
  }
})

app.post('/', async (req, res) => {
  try {
    await axios.post('https://apigw.bi.group/sales-crm/integration/siteApplications', {
      ...req.body
    }, {
      headers: {
        'Authorization': req.headers['authorization'],
        'Content-Type': req.headers['content-type'],
        'Postman-Token': req.headers['postman-token'],
        'cache-control': req.headers['cache-control']
      },
    }).then(response => {
      res.send(response)
    }).catch(err => {
      res.send(err)
    })
  } catch (err) {
    res.send(err)
  }
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
