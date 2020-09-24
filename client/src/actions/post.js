import axios from "axios";
import { setAlert } from "./alert";
import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  CONSOLE_LOG_ERROR,
  GET_POST,
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
    if (err.response) {
      dispatch({
        type: POST_ERROR,
        payload: {
          msg: err.response.statusText,
          status: err.response.status,
          data: err.response.data,
        },
      });
    } else {
      console.log(err);
      dispatch({
        type: CONSOLE_LOG_ERROR,
      });
    }
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
    if (err.response) {
      dispatch({
        type: POST_ERROR,
        payload: {
          msg: err.response.statusText,
          status: err.response.status,
          data: err.response.data,
        },
      });
    } else {
      console.log(err);
      dispatch({
        type: CONSOLE_LOG_ERROR,
      });
    }
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
    if (err.response) {
      dispatch({
        type: POST_ERROR,
        payload: {
          msg: err.response.statusText,
          status: err.response.status,
          data: err.response.data,
        },
      });
    } else {
      console.log(err);
      dispatch({
        type: CONSOLE_LOG_ERROR,
      });
    }
  }
};

//delete post
export const deletePost = (postId) => async (dispatch) => {
  if (window.confirm("Are you sure? You want to delete this post.")) {
    try {
      await axios.delete(`${URL}/api/posts/${postId}`);
      dispatch({
        type: DELETE_POST,
        payload: postId,
      });

      dispatch(setAlert("Post Remove", "success"));
    } catch (err) {
      if (err.response) {
        dispatch({
          type: POST_ERROR,
          payload: {
            msg: err.response.statusText,
            status: err.response.status,
            data: err.response.data,
          },
        });
      } else {
        console.log(err);
        dispatch({
          type: CONSOLE_LOG_ERROR,
        });
      }
    }
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
    if (err.response) {
      dispatch({
        type: POST_ERROR,
        payload: {
          msg: err.response.statusText,
          status: err.response.status,
          data: err.response.data,
        },
      });
    } else {
      console.log(err);
      dispatch({
        type: CONSOLE_LOG_ERROR,
      });
    }
  }
};

//Get a posts
export const getPost = (postId) => async (dispatch) => {
  try {
    const res = await axios.get(`${URL}/api/posts/${postId}`);
    dispatch({
      type: GET_POST,
      payload: res.data,
    });
  } catch (err) {
    if (err.response) {
      dispatch({
        type: POST_ERROR,
        payload: {
          msg: err.response.statusText,
          status: err.response.status,
          data: err.response.data,
        },
      });
    } else {
      console.log(err);
      dispatch({
        type: CONSOLE_LOG_ERROR,
      });
    }
  }
};
