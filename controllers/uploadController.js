const db = require('../models')

module.exports.uploadProfil = (req, res, next) => {
  db.User.findOne({
    attributes: ['id', 'firstName', 'lastName', 'picture'],
    where: {
      id: req.params.id,
    },
  })
    .then((user) => {
      if (user.id !== req.user.id) {
        return res.status(403).json('unauthorized request')
      }

      let imageURL
      if (req.file) {
        imageURL = `./uploads/profil/${req.file.filename}`
      } else {
        imageURL = null
      }

      db.User.update(
        {
          picture: imageURL,
        },
        {
          where: {
            id: user.id,
          },
        }
      )
        .then(() => res.status(201).send({ message: 'Picture updated' }))
        .catch((error) => res.status(400).send({ message: 'Error: ' + error }))
    })

    .catch((error) => res.status(400).json({ error }))
}

// Upload Profil User  Admin
module.exports.uploadAdmin = (req, res, next) => {
  db.User.findOne({
    attributes: ['id', 'firstName', 'lastName', 'picture'],
    where: {
      id: req.params.id,
    },
  })
    .then(() => {
      let imageURL
      if (req.file) {
        imageURL = `/images/uploads/profil/${req.file.filename}`
      } else {
        imageURL = null
      }

      db.User.update(
        {
          picture: imageURL,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      )
        .then(() => res.status(201).send({ message: 'Picture updated' }))
        .catch((error) => res.status(400).send({ message: 'Error: ' + error }))
    })

    .catch((error) => res.status(400).json({ error }))
}
