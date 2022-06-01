import { Dropdown, DropdownItemProps } from "semantic-ui-react"

import { getName, getVarietyName } from "./Helpers"
import { Species, Variety } from "./SpeciesQuery"

interface VarietySelectorProps {
    species: Species | undefined
    loadingVarieties: boolean
    varieties: Variety[]
    variety: number | undefined
    setVariety: (variety: number | undefined) => void
}

export const VarietySelector = (props: VarietySelectorProps) => {
    const getDisplayName = (v: Variety) => {
        let displayName = getName(props.species!)

        if (!v.isDefault) {
            displayName += " (" + (getVarietyName(v) || "???") + ")"
        }

        return displayName
    }

    const isDisabled = props.varieties.length < 2

    let options: DropdownItemProps[] = []

    if (!isDisabled && !props.loadingVarieties && props.species) {
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
            placeholder={isDisabled ? "-" : "Variety..."}
            options={options}
            disabled={isDisabled}
            value={props.variety}
            onChange={(e, data) => props.setVariety(Number(data.value))} />
    )
}
