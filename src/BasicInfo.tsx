import { useEffect, useState } from "react"
import { Checkbox, Image, Segment } from "semantic-ui-react"

import { VersionGroup } from "./models/VersionGroup"

import { PokemonForm } from "./models/PokemonForm"
import { Species } from "./models/Species"
import { Variety } from "./models/Variety"

import { getEffectiveTypes, getGenus, getName } from "./Helpers"
import { SpeciesFlavourText } from "./SpeciesFlavourText"
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
        fetch(`${process.env.REACT_APP_API_URL}/pokemon-form/${formName}`)
            .then(res => res.json())
            .then(setSprite)
    }

    const fetchSprite = (pokemonName: string) => {
        fetch(`${process.env.REACT_APP_API_URL}/pokemon/${pokemonName}`)
            .then(res => res.json())
            .then(setSprite)
    }

    let species = props.speciesInfo
    let variety = props.variety
    let form = props.form

    if (!species || !variety || !form) {
        return null
    }

    let name = getName(species)
    let formName = getName(form)
    let genus = getGenus(species)
    let effectiveTypes = getEffectiveTypes(variety, form, props.versionGroup)

    return (
        <Segment className="basic-info-container">
            <div className="basic-info">
                <div>
                    <h2 className="species-name">
                        {name}&nbsp;

                        <span className="species-order">
                            (&#x00023;{species.order})
                        </span>
                    </h2>

                    {formName.length > 0 && <p>{formName}</p>}

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
            </div>

            <SpeciesFlavourText speciesInfo={species} versionGroup={props.versionGroup} />
        </Segment>
    )
}
