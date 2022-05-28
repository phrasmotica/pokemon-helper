import { useEffect, useState } from "react"
import { Image, Segment } from "semantic-ui-react"

import { Species } from "./SpeciesQuery"
import { TypeLabel } from "./TypeLabel"

interface BasicInfoProps {
    speciesInfo: Species | undefined
}

interface HasSprite {
    sprites: {
        front_default: string
    }
}

export const BasicInfo = (props: BasicInfoProps) => {
    const [sprite, setSprite] = useState("")

    useEffect(() => {
        if (props.speciesInfo) {
            let variety = props.speciesInfo.varieties.find(v => v.isDefault)!
            fetchSprite(variety.name)
        }
    }, [props.speciesInfo])

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

    let variety = species.varieties.find(v => v.isDefault)!

    let name = species.names[0]!.name
    let formName = ""

    let form = variety.forms[0]!
    if (form.formName.length > 0) {
        formName = form.names[0]!.name
    }

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
