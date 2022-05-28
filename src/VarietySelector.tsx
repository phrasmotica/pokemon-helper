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

    let versionGroupOptions: DropdownItemProps[] = []

    if (!props.loadingVarieties && props.species) {
        versionGroupOptions = props.varieties.map(v => ({
            key: v.id,
            text: getDisplayName(v),
            value: v.id,
        }))
    }

    return (
        <div className="variety-input-container">
            <Dropdown
                fluid
                selection
                loading={props.loadingVarieties}
                placeholder="Variety..."
                options={versionGroupOptions}
                disabled={versionGroupOptions.length < 2}
                value={props.variety}
                onChange={(e, data) => props.setVariety(Number(data.value))} />
        </div>
    )
}
