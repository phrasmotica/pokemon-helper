import { Dropdown } from "semantic-ui-react"

import { getVersionGroupName } from "./Helpers"
import { VersionGroup } from "./models/VersionGroup"

interface VersionGroupSelectorProps {
    loadingVersionGroups: boolean
    versionGroups: VersionGroup[]
    versionGroup: number | undefined
    setVersionGroup: (versionGroup: number | undefined) => void
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
            value={props.versionGroup}
            onChange={(e, data) => props.setVersionGroup(Number(data.value))} />
    )
}
