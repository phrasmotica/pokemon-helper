import { useEffect, useState } from "react"
import { Image } from "semantic-ui-react"

import { HasSprite } from "./models/HasSprite"

import "./PokemonSprite.css"

interface PokemonSpriteProps {
    pokemon?: number | string
    form?: number | string
    showShiny: boolean
}

export const PokemonSprite = (props: PokemonSpriteProps) => {
    const [sprite, setSprite] = useState<HasSprite>()

    useEffect(() => {
        if (props.form) {
            fetchFormSprite(props.form)
        }
        else if (props.pokemon) {
            fetchSprite(props.pokemon)
        }
        else {
            setSprite(undefined)
        }

        return () => setSprite(undefined)
    }, [props.form, props.pokemon])

    const fetchSprite = (pokemon: number | string) => {
        fetch(`${process.env.REACT_APP_API_URL}/pokemon/${pokemon}`)
            .then(res => res.json())
            .then(setSprite)
    }

    const fetchFormSprite = (form: number | string) => {
        fetch(`${process.env.REACT_APP_API_URL}/pokemon-form/${form}`)
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
