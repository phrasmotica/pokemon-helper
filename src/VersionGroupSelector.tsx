import { Dropdown } from "semantic-ui-react"

import { VersionGroup } from "./models/VersionGroup"

import { getVersionGroupName } from "./Helpers"
import { Species } from "./SpeciesQuery"

interface VersionGroupSelectorProps {
    species: Species | undefined
    loadingVersionGroups: boolean
    versionGroups: VersionGroup[]
    versionGroupId: number | undefined
    disabledVersionGroupIds: number[]
    setVersionGroupId: (versionGroupId: number | undefined) => void
}

export const VersionGroupSelector = (props: VersionGroupSelectorProps) => {
    let versionGroupOptions = props.loadingVersionGroups ? [] : props.versionGroups.map(vg => ({
        key: vg.id,
        text: getVersionGroupName(vg),
        value: vg.id,
        disabled: props.disabledVersionGroupIds.includes(vg.id),
    }))

    return (
        <Dropdown
            fluid
            selection
            loading={props.loadingVersionGroups}
            placeholder="Version group..."
            options={versionGroupOptions}
            value={props.versionGroupId}
            onChange={(e, data) => props.setVersionGroupId(Number(data.value))} />
    )
}
