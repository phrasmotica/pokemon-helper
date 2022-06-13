import { Dropdown, DropdownItemProps } from "semantic-ui-react"

import { Species } from "./models/Species"
import { Variety } from "./models/Variety"

import { getName, getVarietyName } from "./util/Helpers"

interface VarietySelectorProps {
    species: Species | undefined
    loadingVarieties: boolean
    varieties: Variety[]
    variety: number | undefined
    setVariety: (variety: number | undefined) => void
}

export const VarietySelector = (props: VarietySelectorProps) => {
    const getDisplayName = (v: Variety) => (
        getName(props.species!) + " (" + (getVarietyName(v) || "default") + ")"
    )

    const isDisabled = props.varieties.length < 2

    if (isDisabled) {
        return null
    }

    let options: DropdownItemProps[] = []

    if (!props.loadingVarieties && props.species) {
        options = props.varieties.map(v => ({
            key: v.id,
            text: getDisplayName(v),
            value: v.id,
        }))
    }

    return (
        <Dropdown
            fluid
            selection
            loading={props.loadingVarieties}
            placeholder="Variety..."
            options={options}
            value={props.variety}
            onChange={(e, data) => props.setVariety(Number(data.value))} />
    )
}
