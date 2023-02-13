const db = require('../models')
const bcrypt = require('bcrypt')
const fs = require('fs')

module.exports.getAllUsers = async (req, res) => {
  const users = await db.User.findAll({
    attributes: { exclude: ['password', 'email'] },
  })
  res.status(200).json(users)
}

exports.getUser = (req, res, next) => {
  db.User.findOne({
    where: {
      id: req.params.id,
    },
    attributes: { exclude: ['password', 'email'] },
    include: [
      {
        model: db.Like,
        attributes: ['PostId', 'UserId'],
      },
    ],
  })
    .then((user) => res.status(200).json(user))

    .catch((error) => res.status(500).json({ error }))
}

exports.updateUser = async (req, res, next) => {
  await db.User.findOne({
    where: { id: req.params.id },
    attributes: { exclude: ['password'] },
  })

    .then((user) => {
      if (user.id !== req.user.id) {
        return res.status(403).json('unauthorized request')
      }
      db.User.update(
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          bio: req.body.bio,
        },
        {
          where: {
            id: user.id,
          },
        }
      )
        .then(() => res.status(201).send({ message: 'Account updated' }))
        .catch((error) => res.status(400).send({ message: 'Error: ' + error }))
    })
    .catch((error) =>
      res.status(500).send({ message: 'User not found - Error: ' + error })
    )
}

exports.updatePassword = async (req, res, next) => {
  await db.User.findOne({
    where: { id: req.params.id },
  })

    .then((user) => {
      if (user.id !== req.user.id) {
        return res.status(403).json('unauthorized request')
      }
      bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
          db.User.update(
            {
              password: hash,
            },
            {
              where: {
                id: user.id,
              },
            }
          )
        })
        .then(() => res.status(201).send({ message: 'Password updated' }))
        .catch((error) => res.status(400).send({ message: 'Error: ' + error }))
    })
    .catch((error) =>
      res.status(500).send({ message: 'User not found - Error: ' + error })
    )
}

exports.deleteUser = (req, res, next) => {
  db.User.findOne({
    where: {
      id: req.params.id,
    },
  })

    .then((user) => {
      if (user.id !== req.user.id) {
        return res.status(403).json('unauthorized request')
      }
      if (user.picture !== null) {
        const filename = user.picture.split(
          `${__dirname}/../client/public/uploads/profil/`
        )[1]
        fs.unlink(
          `${__dirname}/../client/public/uploads/profil/${filename}`,
          () => {
            db.User.destroy({ where: { id: req.params.id } })
            res.status(200).json({ message: 'Account Deleted !' })
          }
        )
      } else {
        db.User.destroy({ where: { id: req.params.id } })
        res.cookie('jwt', '', { maxAge: 1 })
        res.status(200).json({ message: 'Account Deleted !' })
      }
    })

    .catch((error) => res.status(500).json({ error }))
}
