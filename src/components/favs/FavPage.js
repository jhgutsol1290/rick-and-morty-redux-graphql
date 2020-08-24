import React from 'react'
import styles from './favs.module.css'
import Card from '../card/Card'
import { connect } from "react-redux";

function FavPage({ characters = [0] }) {
    function renderCharacter(char, i) {
        return (
            <Card {...char} key={i} hide={true} />
        )
    }
    return (
        <div className={styles.container}>
            <h2>Favoritos</h2>
            {characters.map(renderCharacter)}
            {/* {
                characters.map((char, i) => (
                    <Card {...char} key={i} hide />
                ))
            } */}
            {!characters.length && <h3>No hay personajes agregados</h3>}
        </div>
    )
}

function mapState ({ chars }) {
    return {
        characters: chars.favorites
    }
}

export default  connect(mapState)(FavPage)