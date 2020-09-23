import axios from "axios";
import { setAlert } from "./alert";
import { GET_POSTS, POST_ERROR } from "./types";

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
