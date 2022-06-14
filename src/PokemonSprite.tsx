import { useEffect, useState } from "react"
import { Image } from "semantic-ui-react"

import { HasSprite } from "./models/HasSprite"

import "./PokemonSprite.css"

interface PokemonSpriteProps {
    pokemonId: number
    showShiny: boolean
}

export const PokemonSprite = (props: PokemonSpriteProps) => {
    const [sprite, setSprite] = useState<HasSprite>()

    useEffect(() => {
        fetchSprite(props.pokemonId)
        return () => setSprite(undefined)
    }, [props.pokemonId])

    const fetchSprite = (pokemonId: number) => {
        fetch(`${process.env.REACT_APP_API_URL}/pokemon/${pokemonId}`)
            .then(res => res.json())
            .then(setSprite)
    }

    return (
        <div className="pokemon-sprite-container">
            <Image
                className="sprite"
                src={props.showShiny ? sprite?.sprites.front_shiny : sprite?.sprites.front_default} />
        </div>
    )
}
