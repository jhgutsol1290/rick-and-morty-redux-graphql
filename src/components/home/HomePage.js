import React from "react";
import Card from "../card/Card";
import styles from "./home.module.css";
import { connect } from "react-redux";
import {
  removeCharacterAction,
  addToFavotitesAction,
} from "../../redux/charsDuck";

function Home({ chars, removeCharacterAction, addToFavotitesAction }) {
  // New way of getting redux state
  // const chars = useSelector(store => store.chars.array)
  // const dispatch = useDispatch()

  function renderCharacter() {
    let char = chars[0];
    return <Card leftClick={nextCharacter} rightClick={addFav} {...char} />;
  }

  function addFav() {
    addToFavotitesAction();
  }

  function nextCharacter() {
    removeCharacterAction();
  }

  return (
    <div className={styles.container}>
      <h2>Personajes de Rick y Morty</h2>
      <div>{renderCharacter()}</div>
    </div>
  );
}

function mapState(state) {
  return {
    chars: state.chars.array,
  };
}

export default connect(mapState, {
  removeCharacterAction,
  addToFavotitesAction,
})(Home);
// export default Home
