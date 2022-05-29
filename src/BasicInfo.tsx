import { useEffect, useState } from "react"
import { Image, Segment } from "semantic-ui-react"

import { VersionGroup } from "./models/VersionGroup"

import { getName, getVarietyName } from "./Helpers"
import { PokemonForm, Species, Variety } from "./SpeciesQuery"
import { TypeLabel } from "./TypeLabel"

interface BasicInfoProps {
    speciesInfo: Species | undefined
    variety: Variety | undefined
    form: PokemonForm | undefined
    versionGroup: VersionGroup | undefined
}

interface HasSprite {
    sprites: {
        front_default: string
    }
}

export const BasicInfo = (props: BasicInfoProps) => {
    const [sprite, setSprite] = useState("")

    useEffect(() => {
        if (props.form && !props.form.isDefault) {
            fetchFormSprite(props.form.name)
        }
        else if (props.variety) {
            fetchSprite(props.variety.name)
        }
        else {
            setSprite("")
        }
    }, [props.variety, props.form])

    const fetchFormSprite = (formName: string) => {
        fetch(`https://pokeapi.co/api/v2/pokemon-form/${formName}`)
            .then(res => res.json())
            .then((p: HasSprite) => setSprite(p.sprites.front_default))
    }

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

    let form = props.form
    if (!form) {
        return (
            <Segment className="basic-info">
                <h2>Select a form!</h2>
            </Segment>
        )
    }

    let name = getName(species)
    let formName = getVarietyName(variety)

    let effectiveTypes = variety.types.map(t => t.type)

    let generationId = props.versionGroup?.generation.id
    if (generationId) {
        let pastTypesInGenerationOrder = [...variety.pastTypes]
        pastTypesInGenerationOrder.sort((a, b) => a.generation.id - b.generation.id)

        let relevantGenerationId = pastTypesInGenerationOrder.find(pt => pt.generation.id >= generationId!)?.generation.id
        if (relevantGenerationId) {
            let relevantEntries = pastTypesInGenerationOrder.filter(pt => pt.generation.id === relevantGenerationId)
            effectiveTypes = relevantEntries.map(e => e.type)
        }
    }

    if (form.types.length > 0) {
        effectiveTypes = form.types.map(t => t.type)
    }

    return (
        <Segment className="basic-info">
            <div>
                <h2>{name}</h2>
                {formName.length > 0 && <p>{formName}</p>}

                {effectiveTypes.map(t => <TypeLabel key={t.id} type={t} size="big" />)}
            </div>

            <div>
                <Image src={sprite} />
            </div>
        </Segment>
    )
}
