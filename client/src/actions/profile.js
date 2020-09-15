import axios from "axios";
// import { setAlert } from "./alert";
import { GET_PROFILE, PROFILE_ERROR } from "./types";

const URL = "http://localhost:5000";
//get current user profile
export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await axios.get(`${URL}/api/profile/me`);

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    console.log(err.response);
    dispatch({
      type: PROFILE_ERROR,
      payload: err.response,
    });
  }
};
