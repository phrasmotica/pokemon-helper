import { Dropdown, DropdownItemProps } from "semantic-ui-react"

import { Species } from "./models/Species"
import { Variety } from "./models/Variety"

import { getName, getVarietyName } from "./util/Helpers"

interface VarietySelectorProps {
    species: Species | undefined
    loadingVarieties: boolean
    varieties: Variety[]
    varietyId: number | undefined
    setVarietyId: (id: number | undefined) => void
}

export const VarietySelector = (props: VarietySelectorProps) => {
    const isDisabled = props.varieties.length < 2
    if (isDisabled) {
        return null
    }

    let options: DropdownItemProps[] = []

    if (!props.loadingVarieties && props.species) {
        options = props.varieties.map(v => ({
            key: v.id,
            text: getVarietyName(v) || "Default",
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
            value={props.varietyId}
            onChange={(e, data) => props.setVarietyId(Number(data.value))} />
    )
}
