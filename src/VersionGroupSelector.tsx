import { Dropdown } from "semantic-ui-react"

import { getVersionGroupName } from "./Helpers"
import { VersionGroup } from "./models/VersionGroup"

interface VersionGroupSelectorProps {
    loadingVersionGroups: boolean
    versionGroups: VersionGroup[]
    versionGroupId: number | undefined
    setVersionGroupId: (versionGroupId: number | undefined) => void
}

export const VersionGroupSelector = (props: VersionGroupSelectorProps) => {
    let versionGroupOptions = props.loadingVersionGroups ? [] : props.versionGroups.map(vg => ({
        key: vg.id,
        text: getVersionGroupName(vg),
        value: vg.id,
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
