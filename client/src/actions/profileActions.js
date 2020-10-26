import Axios from "axios";
import {
  CLEAR_CURRENT_PROFILE,
  GET_ERRORS,
  GET_PROFILE,
  PROFILE_LOADING,
  SET_CURRENT_USER,
} from "./types";

export const getCurrentProfile = () => (dispatch) => {
  dispatch(setProfileLoading());
  Axios.get("/api/profile")
    .then((res) =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_PROFILE,
        payload: {},
      })
    );
};

export const createProfile = (profileData, history) => (dispatch) => {
  Axios.post("/api/profile", profileData)
    .then((res) => history.push("/dashboard"))
    .catch((err) => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};

export const deleteAccount = () => (dispatch) => {
  if (window.confirm("Are you sure? This can NOT be undone!")) {
    Axios.delete("/api/profile")
      .then((res) => dispatch({ type: SET_CURRENT_USER, payload: {} }))
      .catch((err) =>
        dispatch({ type: GET_ERRORS, payload: err.response.data })
      );
  }
};

export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING,
  };
};

export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE,
  };
};
