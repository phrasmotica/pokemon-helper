import { useEffect, useState } from "react"
import { Image, Segment } from "semantic-ui-react"

import { Species } from "./SpeciesQuery"

interface BasicInfoProps {
    speciesInfo: Species
}

interface HasSprite {
    sprites: {
        front_default: string
    }
}

export const BasicInfo = (props: BasicInfoProps) => {
    const [sprite, setSprite] = useState("")

    let variety = props.speciesInfo.varieties.find(v => v.isDefault)!
    let typeStr = variety.types.map(t => t.type.names[0]!.name).join("-")

    useEffect(() => {
        let variety = props.speciesInfo.varieties.find(v => v.isDefault)!
        fetchSprite(variety.name)
    }, [props.speciesInfo])

    const fetchSprite = (pokemonName: string) => {
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
            .then(res => res.json())
            .then((p: HasSprite) => setSprite(p.sprites.front_default))
    }

    return (
        <Segment className="basic-info">
            <div>
                <h2>{props.speciesInfo.names[0]!.name}</h2>

                <h4>{typeStr}</h4>
            </div>

            <div>
                <Image src={sprite} />
            </div>
        </Segment>
    )
}
