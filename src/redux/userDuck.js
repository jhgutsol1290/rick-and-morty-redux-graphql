import { loginWithGoogle, signOutGoogle } from "../firebase";
import { retrieveFavs } from "./charsDuck"

// constants
const LOGIN = "LOGIN";
const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGIN_ERROR = "LOGIN_ERROR";

const LOG_OUT = "LOG_OUT"

// initial states
const initialData = {
  loggedIn: false,
  fetching: false,
};

// reducer
export default function reducer(state = initialData, action) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        fetching: true,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        fetching: false,
        loggedIn: true,
        ...action.payload,
      };
    case LOGIN_ERROR:
      return {
        ...state,
        fetching: false,
        error: action.payload,
      };
    case LOG_OUT:
      return {
        ...initialData
      }
    default:
      return state;
  }
}

//auxiliar
function saveStorage(storage) {
  localStorage.storage = JSON.stringify(storage);
}

// actions (actions creators)
export const doGoogleLoginAction = () => async (dispatch, getState) => {
  dispatch({
    type: LOGIN,
  });
  // return loginWithGoogle()
  //   .then((user) => {
  //     dispatch({
  //       type: LOGIN_SUCCESS,
  //       payload: {
  //         uid: user.uid,
  //         displayName: user.displayName,
  //         email: user.email,
  //         photoURL: user.photoURL,
  //       },
  //     });
  //     saveStorage(getState());
  //   })
  //   .catch((e) => {
  //     console.log(e);
  //     dispatch({
  //       type: LOGIN_ERROR,
  //       payload: e.message,
  //     });
  //   });
  try {
    const { uid, displayName, email, photoURL } = await loginWithGoogle();
    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        uid,
        displayName,
        email,
        photoURL,
      },
    });
    saveStorage(getState().user);
    retrieveFavs()(dispatch, getState)
  } catch (e) {
    console.log(e);
    dispatch({
      type: LOGIN_ERROR,
      payload: e.message,
    });
  }
};

export const restoreSessionAction = () => (dispatch) => {
  let user = localStorage.getItem("storage");
  user = JSON.parse(user);
  if (user) {
    dispatch({
      type: LOGIN_SUCCESS,
      payload: user,
    });
  }
};

export const logOutAction = () => (dispatch, getState) => {
  signOutGoogle()
  dispatch({
    type: LOG_OUT
  })
  localStorage.removeItem("storage")
}
