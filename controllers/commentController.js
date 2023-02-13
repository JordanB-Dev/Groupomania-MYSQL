const db = require('../models')

exports.createComment = (req, res, next) => {
  db.Post.findOne({
    where: {
      id: req.params.id || null,
      UserID: req.user.id,
    },
  })
  db.Comment.create({
    comment: req.body.comment,
    PostId: req.params.postId,
    UserId: req.user.id,
  })
    .then(() => res.status(201).json({ message: 'Comment added!' }))

    .catch((error) => res.status(400).json({ error }))
}

module.exports.updateComment = async (req, res) => {
  await db.Comment.findOne({
    where: { id: req.params.id },
  })
    .then((comment) => {
      if (comment.UserId !== req.user.id) {
        return res.status(403).json('unauthorized request')
      }
      db.Comment.update(
        {
          comment: req.body.comment,
        },
        {
          where: {
            id: comment.id,
            UserId: comment.UserId,
          },
        }
      )
        .then(() => res.status(200).send({ message: 'Comment updated' }))
        .catch((error) => res.status(400).send({ message: 'Error: ' + error }))
    })
    .catch((error) =>
      res.status(500).send({ message: 'Comment not found - Error: ' + error })
    )
}

exports.getComments = (req, res, next) => {
  db.Comment.findAll({
    where: {
      PostId: req.params.postId,
    },
    attributes: ['id', 'comment', 'createdAt', 'UserId'],

    order: [['createdAt', 'DESC']],

    include: [
      {
        model: db.User,
        attributes: ['firstName', 'lastName', 'picture', 'id'],
      },
    ],
  })
    .then((comments) => res.status(200).json(comments))

    .catch((error) => res.status(500).json({ error }))
}

exports.getAllComments = (req, res, next) => {
  db.Comment.findAll({
    attributes: ['id', 'comment', 'createdAt', 'UserId', 'PostId'],

    order: [['createdAt', 'DESC']],

    include: [
      {
        model: db.User,
        attributes: ['firstName', 'lastName', 'picture', 'id'],
      },
    ],
  })
    .then((comments) => res.status(200).json(comments))

    .catch((error) => res.status(500).json({ error }))
}

module.exports.deleteComment = async (req, res) => {
  await db.Comment.findOne({
    where: { id: req.params.id },
  })
    .then((comment) => {
      if (comment.UserId !== req.user.id) {
        return res.status(403).json('unauthorized request')
      }
      db.Comment.destroy({
        where: {
          id: req.params.id,
          UserId: comment.UserId,
        },
      })
        .then(() => res.status(200).send({ message: 'Comment deleted' }))
        .catch((error) => res.status(400).send({ message: 'Error: ' + error }))
    })
    .catch((error) =>
      res.status(500).send({ message: 'Comment not found - Error: ' + error })
    )
}
