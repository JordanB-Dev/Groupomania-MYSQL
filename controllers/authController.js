const db = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.signUp = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      db.User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hash,
        isAdmin: false,
      })

        .then(() => res.status(201).json({ message: 'User created !' }))

        .catch(() => res.status(404).json({ error: 'L`email existe déjà !' }))
    })

    .catch((error) => res.status(500).json({ error }))
}

const maxAge = 3 * 24 * 60 * 60 * 1000

const createToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      lastName: user.lastName,
      firstName: user.firstName,
      picture: user.picture,
      isAdmin: user.isAdmin,
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: maxAge,
    }
  )
}

exports.signIn = async (req, res) => {
  db.User.findOne({ where: { email: req.body.email } })
    .then((user) => {
      if (!user) {
        return res.status(401).send({ error: 'Adresse mail inconnu' })
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).send({ error: 'Mot de passe incorrect' })
          } else {
            const token = createToken({
              id: user.id,
              lastName: user.lastName,
              firstName: user.firstName,
              picture: user.picture,
              isAdmin: user.isAdmin,
            })
            res.cookie('jwt', token, {
              maxAge,
              httpOnly: true,
              secure: false, //https only
              domain: process.env.DOMAIN,
            })
            console.log('Cookie created')
            return res.status(200).json({
              id: user.id,
              lastName: user.lastName,
              firstName: user.firstName,
              picture: user.picture,
              isAdmin: user.isAdmin,
            })
          }
        })
        .catch((error) => res.status(500).send({ error: 'Error: ' + error }))
    })
    .catch((error) => res.status(500).json({ error: 'Error: ' + error }))
}

exports.logout = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 })
  res.redirect('/')
}
