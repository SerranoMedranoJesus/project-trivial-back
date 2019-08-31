const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bearerToken = require('express-bearer-token')
const userRouter = require('./routes/user.js')
const quizRouter = require('./routes/quiz')
const loginRouter = require('./routes/auth')

const app = express()
const router = express.Router()

const appSecret = "mi_awesome_secret"
const dbConnStr = "mongodb+srv://JesusDaw:AZUrMFsLrKXvyGmB@cluster0-wdudn.mongodb.net/trivial?retryWrites=true&w=majority"
const routerPrefix = '/api/v1'

app.set("app_secret",appSecret)
app.use(bodyParser.json())
app.use(bearerToken())
app.use(cors())

let db = mongoose.connection;

db.on('error', () => {
  console.log('Error al conectarse a la base de datos');
});
db.once('open', () => {
  console.log('Conectado a la base de datos');
});

mongoose.connect(dbConnStr, { useNewUrlParser: true, useFindAndModify:false });

app.use((req, res, next) => {
  let token = req.token

  if (token) {
    jwt.verify(token, app.get('app_secret'), function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        req.decoded = decoded;
        next()
      }
    });
  }

  if(!token) {
    req.decoded = null
    next()
  }
});

app.use(`${routerPrefix}/quiz`, quizRouter);
app.use(`${routerPrefix}/user`, userRouter);
app.use(`${routerPrefix}/login`, loginRouter);

app.listen(process.env.PORT || 8080, () => {
  console.log('Servidor activo en http://localhost:8080');
});