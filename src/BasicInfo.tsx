import { Checkbox, Icon, Segment } from "semantic-ui-react"

import { PokemonForm } from "./models/PokemonForm"
import { Species } from "./models/Species"
import { Variety } from "./models/Variety"
import { VersionGroup } from "./models/VersionGroup"

import { getEffectiveTypes, getGenus, getName } from "./util/Helpers"

import { PokemonSprite } from "./PokemonSprite"
import { SpeciesFlavourText } from "./SpeciesFlavourText"
import { TypeLabel } from "./TypeLabel"

import "./BasicInfo.css"

interface BasicInfoProps {
    speciesInfo: Species | undefined
    variety: Variety | undefined
    form: PokemonForm | undefined
    versionGroup: VersionGroup | undefined
    showShiny: boolean
    setShowShiny: (showShiny: boolean) => void
}

export const BasicInfo = (props: BasicInfoProps) => {
    const renderGenderRate = (species: Species) => {
        let rate = species.genderRate
        if (rate === -1) {
            return (
                <div className="gender-rate">
                    <span title="genderless">
                        <Icon name="genderless" />
                    </span>

                    <span>100%</span>
                </div>
            )
        }

        let femaleChance = rate * 100 / 8
        let maleChance = 100 - femaleChance

        return (
            <div className="gender-rate">
                <Icon name="man" />
                <span>{maleChance}%</span>
                &nbsp;
                <Icon name="woman" />
                <span>{femaleChance}%</span>
            </div>
        )
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
                <div className="attribute-container">
                    <div className="species-name">
                        <h2>
                            {name}&nbsp;

                            <span className="species-order">
                                (&#x00023;{species.order})
                            </span>
                        </h2>
                    </div>

                    {formName.length > 0 && <div className="form-name">
                        <p>{formName}</p>
                    </div>}

                    {genus.length > 0 && <div className="species-genus">
                        <p>{genus}</p>
                    </div>}

                    <div className="type-labels-container">
                        {effectiveTypes.map(t => <TypeLabel key={t.id} type={t} size="big" />)}
                    </div>

                    {renderGenderRate(species)}
                </div>

                <div className="sprite-container">
                    <PokemonSprite
                        pokemonId={props.variety?.id}
                        formId={!props.form || props.form.isDefault ? undefined : props.form.id}
                        showShiny={props.showShiny} />

                    <Checkbox
                        toggle
                        label="Shiny"
                        checked={props.showShiny}
                        onChange={(e, data) => props.setShowShiny(data.checked ?? false)} />
                </div>
            </div>

            <SpeciesFlavourText speciesInfo={species} versionGroup={props.versionGroup} />
        </Segment>
    )
}
