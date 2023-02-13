const db = require('../models')
const fs = require('fs')

exports.getAllPosts = (req, res, next) => {
  db.Post.findAll({
    attributes: [
      'id',
      'message',
      'imageURL',
      'link',
      'createdAt',
      'updatedAt',
      'UserId',
    ],

    order: [['createdAt', 'DESC']],

    include: [
      {
        model: db.User,
        attributes: ['firstName', 'lastName', 'picture', 'id'],
      },
      {
        model: db.Like,
        attributes: ['PostId', 'UserId'],
        include: [
          {
            model: db.User,
            attributes: ['firstName', 'lastName', 'picture'],
          },
        ],
      },
      {
        model: db.Comment,
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'comment', 'UserId', 'createdAt'],
        include: [
          {
            model: db.User,
            attributes: ['firstName', 'lastName', 'picture'],
          },
        ],
      },
    ],
  })
    .then((posts) => res.status(200).json(posts))

    .catch((error) => res.status(500).json({ error }))
}

exports.getOnePost = (req, res, next) => {
  db.Post.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: db.User,
        attributes: ['firstName', 'lastName', 'picture', 'id'],
      },
      {
        model: db.Like,
        attributes: ['PostId', 'UserId'],
        include: [
          {
            model: db.User,
            attributes: ['firstName', 'lastName', 'picture'],
          },
        ],
      },
      {
        model: db.Comment,
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'comment', 'UserId'],
        include: [
          {
            model: db.User,
            attributes: ['firstName', 'lastName', 'picture'],
          },
        ],
      },
    ],
  })
    .then((post) => res.status(200).json(post))

    .catch((error) => res.status(500).json({ error }))
}

exports.createPost = (req, res, next) => {
  db.User.findOne({
    attributes: ['id', 'firstName', 'lastName', 'picture'],
    where: {
      id: req.user.id,
    },
  })
    .then(() => {
      let imageURL
      if (req.file) {
        imageURL = `./uploads/posts/${req.file.filename}`
      } else {
        imageURL = null
      }

      db.Post.create({
        message: req.body.message,
        imageURL: imageURL,
        link: req.body.link,
        UserId: req.user.id,
      }).then(() => res.status(201).json({ message: 'Post created !' }))
    })

    .catch((error) => res.status(400).json({ error }))
}

exports.updatePost = (req, res, next) => {
  db.Post.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((post) => {
      if (post.UserId !== req.user.id) {
        return res.status(403).json('unauthorized request')
      }

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
          UserId: post.UserId,
          imageURL: newImageUrl,
          link: req.body.link,
        },
        {
          where: { id: post.id },
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
    .then((post) => {
      if (post.UserId !== req.user.id) {
        return res.status(403).json('unauthorized request')
      }
      if (post.imageURL !== null) {
        const filename = post.imageURL.split(
          `${__dirname}/../client/public/uploads/posts/`
        )[1]
        fs.unlink(
          `${__dirname}/../client/public/uploads/posts/${filename}`,
          () => {
            db.Post.destroy(
              { where: { id: post.id } },
              { truncate: true, restartIdentity: true }
            )
            res.status(200).json({ message: 'Post deleted !' })
          }
        )
      } else {
        db.Post.destroy(
          { where: { id: post.id } },
          { truncate: true, restartIdentity: true }
        )
        res.status(200).json({ message: 'Post deleted !' })
      }
    })

    .catch((error) => res.status(500).json({ error }))
}

exports.postLike = async (req, res, next) => {
  try {
    const userLike = await db.Like.findOne({
      where: {
        UserId: req.user.id,
        PostId: req.params.postId,
      },
    })

    if (userLike) {
      await db.Like.destroy(
        {
          where: {
            UserId: req.user.id,
            PostId: req.params.postId,
          },
        },
        { truncate: true }
      )
        .then((data) => res.send(data))
        .catch((err) => res.status(500).send({ message: err }))
    } else {
      db.Like.create({
        UserId: req.user.id,
        PostId: req.params.postId,
      })
        .then((data) => res.send(data))
        .catch((err) => res.status(500).send({ message: err }))
    }
  } catch (error) {
    return res.status(500).send({ error })
  }
}
