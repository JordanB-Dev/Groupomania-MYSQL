const db = require('../models')
const fs = require('fs')

// User
exports.updateUser = async (req, res, next) => {
  db.User.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((user) => {
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

exports.deleteUser = (req, res, next) => {
  db.User.findOne({
    where: {
      id: req.params.id,
    },
  })

    .then((user) => {
      if (user.picture !== null) {
        const filename = user.picture.split('/images/uploads/profil/')[1]
        fs.unlink(`images/uploads/profil/${filename}`, () => {
          db.User.destroy({ where: { id: req.params.id } })
          res.status(200).json({ message: 'Account Deleted !' })
        })
      } else {
        db.User.destroy({ where: { id: req.params.id } })
        res.status(200).json({ message: 'Account Deleted !' })
      }
    })

    .catch((error) => res.status(500).json({ error }))
}

// Post

exports.updatePost = (req, res, next) => {
  db.Post.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((post) => {
      let newImageUrl

      if (req.file) {
        newImageUrl = `./uploads/posts/${req.file.filename}`
      }

      if (newImageUrl && post.imageURL) {
        const filename = post.imageURL.split(
          `${__dirname}/../client/public/uploads/posts/`
        )[1]
        fs.unlink(
          `${__dirname}/../client/public/uploads/posts/${filename}`,
          (error) => {
            if (error) console.log(error)
            else {
              console.log(
                `Deleted file: ${__dirname}/../client/public/uploads/posts/${filename}`
              )
            }
          }
        )
      }

      db.Post.update(
        {
          message: req.body.message,
          imageURL: newImageUrl,
          link: req.body.link,
        },
        {
          where: { id: req.params.id },
        }
      )
        .then(() => res.status(200).json({ message: 'Updated post !' }))
        .catch((error) => res.status(400).json({ error }))
    })
    .catch((error) => res.status(500).json({ error }))
}

exports.deletePost = (req, res, next) => {
  db.Post.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then(() => {
      db.Post.destroy(
        { where: { id: req.params.id } },
        { truncate: true, restartIdentity: true }
      )
      res.status(200).json({ message: 'Post deleted !' })
    })

    .catch((error) => res.status(500).json({ error }))
}

// Comments
module.exports.deleteComment = async (req, res) => {
  await db.Comment.findOne({
    where: { id: req.params.id },
  })
    .then(() => {
      db.Comment.destroy({
        where: {
          id: req.params.id,
        },
      })
        .then(() => res.status(200).send({ message: 'Comment deleted' }))
        .catch((error) => res.status(400).send({ message: 'Error: ' + error }))
    })
    .catch((error) =>
      res.status(500).send({ message: 'Comment not found - Error: ' + error })
    )
}
