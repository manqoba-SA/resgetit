import axios from "axios";
import * as actionTypes from "../constants/authConstants";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (token, resetToken, user) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: token,
    resetToken: resetToken,
    user: user,
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("expirationDate");
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const authLogin = (username, password) => {
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };
  return async (dispatch) => {
    dispatch(authStart());
    await axios
      .post(
        "/rest-auth/login/",
        {
          username: username,
          password: password,
        },
        config
      )
      .then((res) => {
        const token = res.data.key;
        localStorage.setItem("token", token);
        window.location.reload();
        dispatch(authSuccess(token, "", ""));
      })
      .catch((error) => {
        dispatch(authFail(error.response.data));
      });
  };
};

export const authSignup = (username, email, password1, password2) => {
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };
  return async (dispatch) => {
    dispatch(authStart());
    await axios
      .post(
        "/rest-auth/registration/",
        {
          username: username,
          email: email,
          password1: password1,
          password2: password2,
        },
        config
      )
      .then((res) => {
        const token = res.data.key;
        localStorage.setItem("token", token);
        window.location.reload();
        dispatch(authSuccess(token, "", ""));
      })
      .catch((error) => {
        dispatch(authFail(error.response.data));
      });
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    const token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      dispatch(authSuccess(token, "", ""));
    }
  };
};

export const authPassReset = (email) => {
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };
  return (dispatch) => {
    dispatch(authStart());
    axios
      .post(
        "/rest-auth/password/reset/",
        {
          email: email,
        },
        config
      )
      .then((res) => {
        const resetToken = res.data;
        dispatch(authSuccess("", resetToken, ""));
      })
      .catch((error) => {
        dispatch(authFail(error.response.data));
      });
  };
};

export const authConfirmPassReset = (uid, token, pass1, pass2) => {
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };
  return (dispatch) => {
    dispatch(authStart());
    axios
      .post(
        "/rest-auth/password/reset/confirm/",
        {
          uid: uid,
          token: token,
          new_password1: pass1,
          new_password2: pass2,
        },
        config
      )
      .then((res) => {
        const resetToken = res.data.detail;
        dispatch(authSuccess("", resetToken, ""));
      })
      .catch((error) => {
        dispatch(authFail(error.response.data));
      });
  };
};

export const authGetUserInfo = () => {
  return (dispatch) => {
    dispatch(authStart());
    axios
      .get(`rest-auth/user/`, {
        headers: { Authorization: `Token ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        const token = localStorage.getItem("token");
        const user = res.data;
        dispatch(authSuccess(token, "", user));
      })
      .catch((error) => {
        console.log(error);
        dispatch(authFail(error.response.data));
      });
  };
};

export const authUpdateUserInfo = (username, first_name, last_name) => {
  return (dispatch) => {
    dispatch(authStart());
    axios
      .put(
        `rest-auth/user/`,
        {
          username,
          first_name,
          last_name,
        },
        { headers: { Authorization: `Token ${localStorage.getItem("token")}` } }
      )
      .then((res) => {
        const token = localStorage.getItem("token");
        const user = res.data;
        dispatch(authSuccess(token, "", user));
      })
      .catch((error) => {
        console.log(error);
        dispatch(authFail(error.response.data));
      });
  };
};
