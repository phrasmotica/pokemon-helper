import { Dropdown, DropdownItemProps } from "semantic-ui-react"

import { PokemonForm } from "./models/PokemonForm"
import { Species } from "./models/Species"

import { getName } from "./util/Helpers"

interface FormSelectorProps {
    species: Species | undefined
    loadingForms: boolean
    forms: PokemonForm[]
    formId: number | undefined
    setFormId: (id: number | undefined) => void
}

export const FormSelector = (props: FormSelectorProps) => {
    const isDisabled = props.forms.length < 2
    if (isDisabled) {
        return null
    }

    let options: DropdownItemProps[] = []

    if (!props.loadingForms && props.species) {
        options = props.forms.map(f => ({
            key: f.id,
            text: getName(f) || "Default",
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
            value={props.formId}
            onChange={(e, data) => props.setFormId(Number(data.value))} />
    )
}
