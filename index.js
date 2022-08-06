const express = require('express');
const app = express();
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const DB =
  'mongodb+srv://nihalsangole:nihalgolunihal@cluster0.vbzrc3t.mongodb.net/instagram?retryWrites=true&w=majority';
const port = process.env.port || 8080;

mongoose.connect(
  DB,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log('connected to mongo db');
  }
);

app.get('/', (req, res) => {
  res.send('instagram api server is live');
});
//middleware

app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/posts', postRoute);

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
