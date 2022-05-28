import { Dropdown, DropdownItemProps } from "semantic-ui-react"

import { getName } from "./Helpers"
import { PokemonForm, Species } from "./SpeciesQuery"

interface FormSelectorProps {
    species: Species | undefined
    loadingForms: boolean
    forms: PokemonForm[]
    form: number | undefined
    setForm: (form: number | undefined) => void
}

export const FormSelector = (props: FormSelectorProps) => {
    const getDisplayName = (f: PokemonForm) => {
        let displayName = getName(props.species!)

        if (!f.isDefault) {
            displayName += " (" + (getName(f) || f.name) + ")"
        }

        return displayName
    }

    let versionGroupOptions: DropdownItemProps[] = []

    if (!props.loadingForms && props.species) {
        versionGroupOptions = props.forms.map(f => ({
            key: f.id,
            text: getDisplayName(f),
            value: f.id,
        }))
    }

    return (
        <div className="form-input-container">
            <Dropdown
                fluid
                selection
                loading={props.loadingForms}
                placeholder="Form..."
                options={versionGroupOptions}
                disabled={versionGroupOptions.length < 2}
                value={props.form}
                onChange={(e, data) => props.setForm(Number(data.value))} />
        </div>
    )
}
