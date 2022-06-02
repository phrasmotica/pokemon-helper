import { useEffect, useState } from "react"
import { Checkbox, Image, Segment } from "semantic-ui-react"

import { VersionGroup } from "./models/VersionGroup"

import { getEffectiveTypes, getGenus, getName } from "./Helpers"
import { PokemonForm, Species, Variety } from "./SpeciesQuery"
import { TypeLabel } from "./TypeLabel"

import "./BasicInfo.css"

interface BasicInfoProps {
    speciesInfo: Species | undefined
    variety: Variety | undefined
    form: PokemonForm | undefined
    versionGroup: VersionGroup | undefined
}

interface HasSprite {
    sprites: {
        front_default: string,
        front_shiny: string,
    }
}

export const BasicInfo = (props: BasicInfoProps) => {
    const [sprite, setSprite] = useState<HasSprite>()
    const [showShiny, setShowShiny] = useState(false)

    useEffect(() => {
        if (props.form && !props.form.isDefault) {
            fetchFormSprite(props.form.name)
        }
        else if (props.variety) {
            fetchSprite(props.variety.name)
        }
        else {
            setSprite(undefined)
        }
    }, [props.variety, props.form])

    const fetchFormSprite = (formName: string) => {
        fetch(`https://pokeapi.co/api/v2/pokemon-form/${formName}`)
            .then(res => res.json())
            .then(setSprite)
    }

    const fetchSprite = (pokemonName: string) => {
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
            .then(res => res.json())
            .then(setSprite)
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
    let genus = getGenus(species)
    let effectiveTypes = getEffectiveTypes(variety, form, props.versionGroup)

    return (
        <Segment className="basic-info">
            <div>
                <h2 className="species-name">
                    {name}&nbsp;

                    <span className="species-order">
                        (&#x00023;{species.order})
                    </span>
                </h2>

                {genus.length > 0 && <p>{genus}</p>}

                <div className="type-labels-container">
                    {effectiveTypes.map(t => <TypeLabel key={t.id} type={t} size="big" />)}
                </div>
            </div>

            <div className="sprite-container">
                <Image
                    className="sprite"
                    src={showShiny ? sprite?.sprites.front_shiny : sprite?.sprites.front_default} />

                <Checkbox
                    toggle
                    label="Shiny"
                    checked={showShiny}
                    onChange={(e, data) => setShowShiny(data.checked ?? false)} />
            </div>
        </Segment>
    )
}
