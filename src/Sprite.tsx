import { useEffect, useState } from "react"
import { Checkbox, Image, Loader } from "semantic-ui-react"

import { Pokemon } from "./models/Encounter"
import { PokemonForm } from "./models/PokemonForm"
import { Variety } from "./models/Variety"

import "./Sprite.css"

interface SpriteProps {
    pokemon: Pokemon | Variety
    form?: PokemonForm
    showShinyToggle?: boolean
}

interface HasSprite {
    sprites: {
        front_default: string,
        front_shiny: string,
    }
}

export const Sprite = (props: SpriteProps) => {
    const [sprite, setSprite] = useState<HasSprite>()
    const [loading, setLoading] = useState(false)
    const [showShiny, setShowShiny] = useState(false)

    useEffect(() => {
        if (props.form && !props.form.isDefault) {
            fetchFormSprite(props.form.name)
        }
        else if (props.pokemon) {
            fetchSprite(props.pokemon.name)
        }
        else {
            setSprite(undefined)
        }
    }, [props.pokemon, props.form])

    const fetchFormSprite = (formName: string) => {
        setLoading(true)

        fetch(`${process.env.REACT_APP_API_URL}/pokemon-form/${formName}`)
            .then(res => res.json())
            .then(setSprite)
            .finally(() => setLoading(false))
    }

    const fetchSprite = (pokemonName: string) => {
        setLoading(true)

        fetch(`${process.env.REACT_APP_API_URL}/pokemon/${pokemonName}`)
            .then(res => res.json())
            .then(setSprite)
            .finally(() => setLoading(false))
    }

    const renderImage = () => {
        if (loading) {
            return (
                <div className="loader-container">
                    <Loader active inline />
                </div>
            )
        }

        return (
            <Image
                className="sprite"
                src={showShiny ? sprite?.sprites.front_shiny : sprite?.sprites.front_default} />
        )
    }

    return (
        <div className="sprite-container">
            {renderImage()}

            {props.showShinyToggle && <Checkbox
                toggle
                label="Shiny"
                checked={showShiny}
                onChange={(e, data) => setShowShiny(data.checked ?? false)} />}
        </div>
    )
}
