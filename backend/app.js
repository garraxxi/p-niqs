const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postRouter = require("./routes/posts")
const userRouter = require("./routes/users")

const app = express();

mongoose.connect('mongodb+srv://edg:' + process.env.MONGO_ATLAS_PWD + '@tuto.1l3kwbe.mongodb.net/mean-app?retryWrites=true&w=majority')
  .then(console.log('connected to database'))
  .catch(console.log);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static(path.join('images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});

app.use('/api/posts', postRouter);
app.use('/api/users', userRouter);

module.exports = app;
