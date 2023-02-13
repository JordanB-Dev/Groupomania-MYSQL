const jwt = require('jsonwebtoken')
const db = require('../models')

module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null
        next()
      } else {
        let user = await db.User.findByPk(decodedToken.id)
        res.locals.user = user
        next()
      }
    })
  } else {
    res.locals.user = null
    next()
  }
}

module.exports.isAuth = (req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err)
        res.send(200).json('no token')
      } else {
        req.user = decodedToken
        console.log(decodedToken.id)
        next()
      }
    })
  } else {
    console.log('No token')
    res.status(401).json({
      error: 'Authentication required !',
    })
  }
}

module.exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401).send({ message: 'Invalid Admin Token' })
  }
}
