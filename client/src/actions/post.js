import axios from "axios";
import { setAlert } from "./alert";
import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
} from "./types";

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

//delete post
export const deletePost = (postId) => async (dispatch) => {
  try {
    await axios.delete(`${URL}/api/posts/${postId}`);
    dispatch({
      type: DELETE_POST,
      payload: postId,
    });

    dispatch(setAlert("Post Remove", "success"));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: err.response,
    });
  }
};

//add post
export const addPost = (formData) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axios.post(`${URL}/api/posts`, formData, config);

    dispatch({
      type: ADD_POST,
      payload: res.data,
    });

    dispatch(setAlert("Post Created", "success"));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: err.response,
    });
  }
};
