import express, { Request, Response, NextFunction } from 'express'
import methodOverride from 'method-override'
import morgan from 'morgan'
import path from 'path'
import favicon from 'serve-favicon'
import session from 'express-session'
import useragent from 'express-useragent'
import errorhandler from 'errorhandler'
import { connect } from 'mongoose'
require('dotenv').config()
import cors from './corss'
import routes from './routes'
import * as database from './database'
import * as indexer from './indexer'
import contracts from './config.json'

const isProduction = process.env.NODE_ENV === 'production'

// Create global app object
const app = express()

// Normal express config defaults
app.use(morgan('dev'))
app.use(express.json())
app.use(cors)
app.use(
  express.urlencoded({
    extended: true,
  })
)

app.use(useragent.express())
app.use(methodOverride())
app.use(express.static(__dirname + '/public'))
app.use(favicon(path.join(__dirname, '../public', 'favicon.png')))

const secret = process.env.SECRET || '2$JNS393S$39K3YL9382$67XHGDL39'
app.use(
  session({
    secret: secret,
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  })
)

if (!isProduction) {
  app.use(errorhandler())
}

const mongourl: string = process.env.MONGODB_URI || ''
connect(mongourl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('mongodb connected!')
  for (let contract of contracts) {
    contract.name = contract.name.toLowerCase()
  }
  database.initialize(contracts).then(() => {
    indexer.updateLedger(contracts)
  })
})

app.use(routes)

/// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  var err = new Error('Not Found')
  next(err)
})

/// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use((err: any, req: Request, res: Response) => {
    console.log(err.stack)

    res.status(err.status || 500)

    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use((err: any, req: Request, res: Response) => {
  res.status(err.status || 500)
  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  })
})

// get the unhandled rejection and throw it to another fallback handler we already have.
process.on('unhandledRejection', (reason, promise) => {
  throw reason
})

process.on('uncaughtException', (err) => {
  console.error('There was an uncaught error', err)
  process.exit(1) //mandatory (as per the Node.js docs)
})

// finally, let's start our server...
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`Server is listening on ${port} port`)
})

export default server
