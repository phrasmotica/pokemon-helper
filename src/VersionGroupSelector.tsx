import { Dropdown } from "semantic-ui-react"

import { VersionGroup } from "./models/VersionGroup"

import { getVersionGroupName } from "./Helpers"
import { Species } from "./SpeciesQuery"

interface VersionGroupSelectorProps {
    species: Species | undefined
    loadingVersionGroups: boolean
    versionGroups: VersionGroup[]
    versionGroupId: number | undefined
    setVersionGroupId: (versionGroupId: number | undefined) => void
}

export const VersionGroupSelector = (props: VersionGroupSelectorProps) => {
    let disabledVersionGroups = props.species ? props.versionGroups.filter(vg => vg.generation.id < props.species!.generation.id) : []
    let disabledVersionGroupIds = disabledVersionGroups.map(vg => vg.id)

    let versionGroupOptions = props.loadingVersionGroups ? [] : props.versionGroups.map(vg => ({
        key: vg.id,
        text: getVersionGroupName(vg),
        value: vg.id,
        disabled: disabledVersionGroupIds.includes(vg.id),
    }))

    // ensure a valid version group is selected
    let value = props.versionGroupId
    if (value && disabledVersionGroupIds.includes(value)) {
        let newValue = props.versionGroups.find(vg => !disabledVersionGroupIds.includes(vg.id))?.id
        props.setVersionGroupId(newValue)
    }

    return (
        <Dropdown
            fluid
            selection
            loading={props.loadingVersionGroups}
            placeholder="Version group..."
            options={versionGroupOptions}
            value={value}
            onChange={(e, data) => props.setVersionGroupId(Number(data.value))} />
    )
}
