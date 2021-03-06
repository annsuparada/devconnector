import axios from "axios";
import { setAlert } from "./alert";
import {
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  ACCOUNT_DELETED,
  // CLEAR_PROFILE,
  GET_REPOS,
  CONSOLE_LOG_ERROR,
} from "./types";

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
    if (err.response) {
      dispatch({
        type: PROFILE_ERROR,
        payload: {
          msg: err.response.statusText,
          status: err.response.status,
          data: err.response.data.errors,
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

//get all profiles
export const getProfiles = () => async (dispatch) => {
  try {
    const res = await axios.get(`${URL}/api/profile`);
    dispatch({
      type: GET_PROFILES,
      payload: res.data,
    });
  } catch (err) {
    if (err.response) {
      dispatch({
        type: PROFILE_ERROR,
        payload: {
          msg: err.response.statusText,
          status: err.response.status,
          data: err.response.data.errors,
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

//get profile by ID
export const getProfileById = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(`${URL}/api/profile/user/${userId}`);

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    if (err.response) {
      dispatch({
        type: PROFILE_ERROR,
        payload: {
          msg: err.response.statusText,
          status: err.response.status,
          data: err.response.data.errors,
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

//get github repos
export const getGithubRepos = (username) => async (dispatch) => {
  try {
    const res = await axios.get(`${URL}/api/profile/github/${username}`);

    dispatch({
      type: GET_REPOS,
      payload: res.data,
    });
  } catch (err) {
    if (err.response) {
      dispatch({
        type: PROFILE_ERROR,
        payload: {
          msg: err.response.statusText,
          status: err.response.status,
          data: err.response.data.errors,
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

//create or update profile
export const createProfile = (formData, history, edit = false) => async (
  dispatch
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.post(`${URL}/api/profile`, formData, config);
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert(edit ? "Profile Updated" : "Profile Created", "success"));

    if (!edit) {
      history.push("./dashboard");
    }
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => {
        dispatch(setAlert(error.msg, "danger"));
      });
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: err.response,
    });
  }
};

//Add experience
export const addExperience = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.put(
      `${URL}/api/profile/experience`,
      formData,
      config
    );
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert("Experience Added", "success"));
    history.push("./dashboard");
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => {
        dispatch(setAlert(error.msg, "danger"));
      });
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: err.response,
    });
  }
};

//Add education
export const addEducation = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.put(
      `${URL}/api/profile/education`,
      formData,
      config
    );
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert("Education Added", "success"));
    history.push("./dashboard");
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => {
        dispatch(setAlert(error.msg, "danger"));
      });
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: err.response,
    });
  }
};

//Delete Experience
export const deleteExperience = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`${URL}/api/profile/experience/${id}`);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert("Experience Removed", "success"));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: err.response,
    });
  }
};

//Delete Education
export const deleteEducation = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`${URL}/api/profile/education/${id}`);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert("Education Removed", "success"));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: err.response,
    });
  }
};

//Delete account & profile
export const deleteAccount = () => async (dispatch) => {
  if (window.confirm("Are you sure? This can NOT be undone!")) {
    try {
      await axios.delete(`${URL}/api/profile`);

      dispatch({ type: ACCOUNT_DELETED });
      dispatch({ type: UPDATE_PROFILE });

      dispatch(
        setAlert("Your account has been permanantly deleted", "success")
      );
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: err.response,
      });
    }
  }
};
