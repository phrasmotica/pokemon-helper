import { useEffect, useState } from "react"
import { Image, Segment } from "semantic-ui-react"

import { getVarietyName } from "./Helpers"
import { Species, Variety } from "./SpeciesQuery"
import { TypeLabel } from "./TypeLabel"

interface BasicInfoProps {
    speciesInfo: Species | undefined
    variety: Variety | undefined
}

interface HasSprite {
    sprites: {
        front_default: string
    }
}

export const BasicInfo = (props: BasicInfoProps) => {
    const [sprite, setSprite] = useState("")

    useEffect(() => {
        if (props.variety) {
            fetchSprite(props.variety.name)
        }
        else {
            setSprite("")
        }
    }, [props.variety])

    const fetchSprite = (pokemonName: string) => {
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
            .then(res => res.json())
            .then((p: HasSprite) => setSprite(p.sprites.front_default))
    }

    let species = props.speciesInfo
    if (!species) {
        return (
            <Segment className="basic-info">
                <h2>Search for a species!</h2>
            </Segment>
        )
    }

    let variety = props.variety
    if (!variety) {
        return (
            <Segment className="basic-info">
                <h2>Select a variety!</h2>
            </Segment>
        )
    }

    let name = species.names[0]!.name
    let formName = getVarietyName(variety)

    return (
        <Segment className="basic-info">
            <div>
                <h2>{name}</h2>
                {formName.length > 0 && <p>{formName}</p>}

                {variety.types.map(t => <TypeLabel type={t.type} size="big" />)}
            </div>

            <div>
                <Image src={sprite} />
            </div>
        </Segment>
    )
}
