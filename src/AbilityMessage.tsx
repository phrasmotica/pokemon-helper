import { Message } from "semantic-ui-react"

import { VersionGroup } from "./models/VersionGroup"

import { getVersionGroupName } from "./util/Helpers"

interface AbilityMessageProps {
    versionGroup: VersionGroup
}

export const AbilityMessage = (props: AbilityMessageProps) => (
    <Message warning>
        Abilities do not exist in {getVersionGroupName(props.versionGroup)}.
    </Message>
)
