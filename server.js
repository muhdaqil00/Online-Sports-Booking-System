if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')

const indexRouter = require('./routes/index')
const indexFacility = require('./routes/facility')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false}))
app.use(methodOverride('_method'))
app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    
  }));
app.use(flash())

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('CONNECTED TO MONGO DB'))

app.use('/', indexRouter)
app.use('/facility', indexFacility)

app.listen(process.env.PORT || 3000)
