import {
  GET_POSTS,
  LIKE_POST,
  UPDATE_POST,
  UPDATE_POST_ADMIN,
  DELETE_POST,
  DELETE_POST_ADMIN,
  EDIT_COMMENT,
  DELETE_COMMENT,
  DELETE_COMMENT_ADMIN,
} from '../actions/post.actions'

const initialState = {}

export default function postReducer(state = initialState, action) {
  switch (action.type) {
    case GET_POSTS:
      return action.payload
    case LIKE_POST:
      return state.map((post) => {
        if (post.id === action.payload.UserId) {
          return {
            ...post,
            Likes: [action.payload.userId, ...post.Likes],
          }
        }
        return post
      })
    case UPDATE_POST:
      return state.map((post) => {
        if (post.id === action.payload.postId) {
          return {
            ...post,
            message: action.payload.message,
          }
        } else return post
      })
    case UPDATE_POST_ADMIN:
      return state.map((post) => {
        if (post.id === action.payload.postId) {
          return {
            ...post,
            message: action.payload.message,
          }
        } else return post
      })
    case DELETE_POST:
      return state.filter((post) => post.id !== action.payload.postId)
    case DELETE_POST_ADMIN:
      return state.filter((post) => post.id !== action.payload.postId)
    case EDIT_COMMENT:
      return state.map((post) => {
        if (post.id === action.payload.postId) {
          return {
            ...post,
            comment: post.Comments.map((comments) => {
              if (comments.id === action.payload.commentId) {
                return {
                  ...comments,
                  comment: action.payload.comment,
                }
              } else {
                return comments
              }
            }),
          }
        } else return post
      })
    case DELETE_COMMENT:
      return state.filter((comment) => comment.id !== action.payload.commentId)
    case DELETE_COMMENT_ADMIN:
      return state.filter((comment) => comment.id !== action.payload.commentId)
    default:
      return state
  }
}
