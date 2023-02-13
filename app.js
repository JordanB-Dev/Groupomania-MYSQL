const express = require('express')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const path = require('path')
require('dotenv').config({ path: '.env' })
const { checkUser, isAuth } = require('./middleware/authMiddleware')
const cors = require('cors')
require('./models')

const userRoutes = require('./routes/userRoute')
const postRoutes = require('./routes/postRoutes')
const commentRoutes = require('./routes/commentRoutes')
const adminRoutes = require('./routes/adminRoutes')

const app = express()

app.use(helmet())
app.use(helmet.xssFilter())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', `${process.env.URL}`)
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  )
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  next()
})

const corsOptions = {
  origin: process.env.URL,
  credentials: true,
  allowedHeaders: ['sessionId', 'Content-Type'],
  exposedHeaders: ['sessionId'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
}
app.use(cors(corsOptions))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(express.static('images'))

app.get('*', checkUser)
app.get('/jwtid', isAuth, (req, res) => {
  res.status(200).json(res.locals.user.id)
})

app.use('/api/user', userRoutes)
app.use('/api/post', postRoutes)
app.use('/api/comment', commentRoutes)
app.use('/api/admin', adminRoutes)

module.exports = app
