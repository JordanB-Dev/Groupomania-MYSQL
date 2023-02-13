import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addComment, getPosts } from '../../actions/post.actions'
import EditDeleteComment from '../EditDeleteComment'
import { dateParser, isEmpty } from '../Utils'

const CommentPost = ({ post }) => {
  const [comment, setComment] = useState('')
  const usersData = useSelector((state) => state.usersReducer)
  const userData = useSelector((state) => state.userReducer)
  const dispatch = useDispatch()

  const handleComment = (e) => {
    e.preventDefault()

    if (comment) {
      dispatch(
        addComment(
          post.id,
          userData.id,
          comment,
          userData.firstName,
          userData.lastName
        )
      )
        .then(() => dispatch(getPosts()))
        .then(() => setComment(''))
    }
  }

  return (
    <div className="comments_container">
      {post.Comments.map((comments) => {
        return (
          <div
            className={
              comments.UserId === userData.id ? 'comment client' : 'comment'
            }
            key={comments.id}
          >
            <div className="left_part">
              <img
                src={
                  !isEmpty(usersData[0]) &&
                  usersData
                    .map((user) => {
                      if (user.id === comments.UserId) return user.picture
                      else return null
                    })
                    .join('')
                }
                alt="commenter_pic"
              />
            </div>
            <div className="right_part">
              <div className="comment_header">
                <div className="pseudo ">
                  <h3>{comments.User.firstName}</h3>
                  <h3 className="margin">{comments.User.lastName}</h3>
                </div>
                <span>{dateParser(comments.createdAt)}</span>
              </div>
              <p>{comments.comment}</p>
              <EditDeleteComment comments={comments} commentId={comments.id} />
            </div>
          </div>
        )
      })}
      {userData.id && (
        <form action="" onSubmit={handleComment} className="comment_form">
          <input
            type="text"
            name="text"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            placeholder="Laisser un commentaire"
          />
          <br />
          <input type="submit" value="Envoyer" />
        </form>
      )}
    </div>
  )
}

export default CommentPost
