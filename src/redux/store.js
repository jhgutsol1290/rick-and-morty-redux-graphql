import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import userReducer, { restoreSessionAction } from "./userDuck";
import charsReducer, { getCharactersAction } from "./charsDuck";

const rootReducer = combineReducers({
  user: userReducer,
  chars: charsReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function generateStore() {
  const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk))
  );

  // get chars for fisrt time
  getCharactersAction()(store.dispatch, store.getState);
  restoreSessionAction()(store.dispatch);
  return store;
}
