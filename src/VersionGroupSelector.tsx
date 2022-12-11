import { Dropdown } from "semantic-ui-react"

import { VersionGroup } from "./models/VersionGroup"

import { getVersionGroupName } from "./util/Helpers"

import "./VersionGroupSelector.css"

interface VersionGroupSelectorProps {
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
        <div className="version-group-selector-container">
            <h4>Version Group</h4>

            <Dropdown
                fluid
                selection
                search
                loading={props.loadingVersionGroups}
                placeholder="Version group..."
                options={versionGroupOptions}
                value={props.versionGroupId}
                onChange={(e, data) => props.setVersionGroupId(Number(data.value))} />
        </div>
    )
}
