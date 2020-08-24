import axios from "axios";
import { updateDB, getFavs } from "../firebase";
import ApolloClient, { gql } from "apollo-boost";

// constants
const GET_CHARACTERS = "GET_CHARACTERS";
const GET_CHARACTERS_SUCCESS = "GET_CHARACTERS_SUCCESS";
const GET_CHARACTERS_ERROR = "GET_CHARACTERS_ERROR";

const UPDATE_PAGE = "UPDATE_PAGE";

const REMOVE_CHARACTER = "REMOVE_CHARACTER";
const ADD_TO_FAVORITES = "ADD_TO_FAVORITES";

const GET_FAVS = "GET_FAVS";
const GET_FAVS_SUCCESS = "GET_FAVS_SUCCESS";
const GET_FAVS_ERROR = "GET_FAVS_ERROR";

// initial state
const initialData = {
  fetching: false,
  array: [],
  current: {},
  favorites: [],
  nextPage: 1,
};

const URL = process.env.REACT_APP_BACK_ADDRESS;
const uri = process.env.REACT_APP_BACK_ADDRESS_GRAPHQL;

const client = new ApolloClient({
  uri,
});

// reducer
export default function reducer(state = initialData, action) {
  switch (action.type) {
    case UPDATE_PAGE:
      return {
        ...state,
        nextPage: action.payload,
      };
    case GET_FAVS:
      return {
        ...state,
        fetching: true,
      };
    case GET_FAVS_ERROR:
      return {
        ...state,
        fetching: false,
        error: action.payload,
      };
    case GET_FAVS_SUCCESS:
      return {
        ...state,
        fetching: false,
        favorites: action.payload,
      };
    case ADD_TO_FAVORITES:
      return {
        ...state,
        ...action.payload,
      };
    case REMOVE_CHARACTER:
      return {
        ...state,
        array: action.payload,
      };
    case GET_CHARACTERS:
      return { ...state, fetching: true };
    case GET_CHARACTERS_ERROR:
      return {
        ...state,
        fetching: false,
        error: action.payload,
      };
    case GET_CHARACTERS_SUCCESS:
      return {
        ...state,
        array: action.payload,
        fetching: false,
      };
    default:
      return state;
  }
}

// actions (actions creators) thunk
export const retrieveFavs = () => async (dispatch, getState) => {
  dispatch({
    type: GET_FAVS,
  });
  const { uid } = getState().user;
  // return getFavs(uid)
  //   .then((array) => {
  //     dispatch({
  //       type: GET_FAVS_SUCCESS,
  //       payload: [...array],
  //     });
  //   })
  //   .catch((e) => {
  //     console.log(e);
  //     dispatch({
  //       type: GET_FAVS_ERROR,
  //       payload: e.message,
  //     });
  //   });
  try {
    const array = await getFavs(uid);
    dispatch({
      type: GET_FAVS_SUCCESS,
      payload: [...array],
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: GET_FAVS_ERROR,
      payload: error.message,
    });
  }
};

export const getCharactersAction = () => (dispatch, getState) => {
  // With Graphql

  const query = gql`
    query($page: Int) {
      characters(page: $page) {
        info {
          pages
          next
          prev
        }
        results {
          name
          image
        }
      }
    }
  `;

  dispatch({
    type: GET_CHARACTERS,
  });

  const { nextPage } = getState().chars;

  return client
    .query({
      query,
      variables: {
        page: nextPage,
      },
    })
    .then(({ data, error }) => {
      if (error) {
        dispatch({
          type: GET_CHARACTERS_ERROR,
          payload: error,
        });
        return;
      }
      dispatch({
        type: GET_CHARACTERS_SUCCESS,
        payload: [...data.characters.results],
      });
      dispatch({
        type: UPDATE_PAGE,
        payload: data.characters.info.next ? data.characters.info.next : 1,
      });
    });

  // With axios

  // dispatch({
  //   type: GET_CHARACTERS,
  // });
  // return axios
  //   .get(URL)
  //   .then((res) => {
  //     dispatch({
  //       type: GET_CHARACTERS_SUCCESS,
  //       payload: res.data.results,
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     dispatch({
  //       type: GET_CHARACTERS_ERROR,
  //       payload: err.response.message,
  //     });
  //   });
};

export const removeCharacterAction = () => (dispatch, getState) => {
  const { array } = getState().chars;
  array.shift();
  if (!array.length) {
    // getCharactersAction()(dispatch, getState);
    dispatch(getCharactersAction());
    return;
  }
  dispatch({
    type: REMOVE_CHARACTER,
    payload: [...array],
  });
};

export const addToFavotitesAction = () => (dispatch, getState) => {
  const { array, favorites } = getState().chars;
  const { uid } = getState().user;
  const char = array.shift();
  favorites.push(char);
  updateDB(favorites, uid);
  dispatch({
    type: ADD_TO_FAVORITES,
    // always send a copy of data with spread operator (...data) when using arrays or objects
    payload: {
      array: [...array],
      favorites: [...favorites],
    },
  });
};
