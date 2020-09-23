import axios from "axios";
import { setAlert } from "./alert";
import { GET_POSTS, POST_ERROR, UPDATE_LIKES } from "./types";

const URL = "http://localhost:5000";

//Get all posts
export const getPosts = () => async (dispatch) => {
  try {
    const res = await axios.get(`${URL}/api/posts`);
    dispatch({
      type: GET_POSTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: err.response,
    });
  }
};

//add likes
export const addLike = (postId) => async (dispatch) => {
  try {
    const res = await axios.put(`${URL}/api/posts/like/${postId}`);
    dispatch({
      type: UPDATE_LIKES,
      payload: { postId, likes: res.data },
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: err.response,
    });
  }
};

//remove likes
export const removeLike = (postId) => async (dispatch) => {
  try {
    const res = await axios.put(`${URL}/api/posts/unlike/${postId}`);
    dispatch({
      type: UPDATE_LIKES,
      payload: { postId, likes: res.data },
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: err.response,
    });
  }
};
