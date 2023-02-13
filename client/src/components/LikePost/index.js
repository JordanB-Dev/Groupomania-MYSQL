import { useContext, useState } from 'react'
import { UidContext } from '../AppContext'
import { useDispatch } from 'react-redux'
import { getPosts, likePost } from '../../actions/post.actions'

const LikePost = ({ post }) => {
  const [liked, setLiked] = useState(false)
  const uid = useContext(UidContext)
  const dispatch = useDispatch()

  const like = () => {
    dispatch(likePost(post.id, uid))
    dispatch(getPosts())
    setLiked(true)
  }

  const unlike = () => {
    dispatch(likePost(post.id, uid))
    dispatch(getPosts())
    setLiked(false)
  }

  return (
    <div className="card_footer_like">
      {liked === false && (
        <img src="./img/icons/heart.svg" onClick={like} alt="like" />
      )}
      {liked && (
        <img src="./img/icons/heart-filled.svg" onClick={unlike} alt="unlike" />
      )}
      <span>{post.Likes.length}</span>
    </div>
  )
}

export default LikePost
