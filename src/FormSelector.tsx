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

    const isDisabled = props.forms.length < 2

    if (isDisabled) {
        return null
    }

    let options: DropdownItemProps[] = []

    if (!props.loadingForms && props.species) {
        options = props.forms.map(f => ({
            key: f.id,
            text: getDisplayName(f),
            value: f.id,
        }))
    }

    return (
        <Dropdown
            fluid
            selection
            loading={props.loadingForms}
            placeholder="Form..."
            options={options}
            value={props.form}
            onChange={(e, data) => props.setForm(Number(data.value))} />
    )
}
