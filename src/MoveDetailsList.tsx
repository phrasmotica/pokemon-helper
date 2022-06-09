import { List } from "semantic-ui-react"

import { PokemonMove } from "./models/Variety"

import { getDisplayText, getName, sortMoveDetails } from "./Helpers"
import { MoveInformation } from "./MoveInformation"
import { TypeLabel } from "./TypeLabel"

import "./MoveDetailsList.css"

interface MoveDetailsListProps {
    moveDetails: PokemonMove[]
    versionGroupId: number | undefined
}

export const MoveDetailsList = (props: MoveDetailsListProps) => {
    let moveDetails = [...props.moveDetails]
    moveDetails.sort(sortMoveDetails)

    return (
        <div className="move-details-list">
            <List divided relaxed>
                {moveDetails.map(md => (
                    <List.Item key={md.id}>
                        <div className="move-detail">
                            <div className="move-name-container">
                                <MoveInformation
                                    moveId={md.move.id}
                                    versionGroupId={props.versionGroupId} />

                                <span>{getName(md.move)}</span>

                                <TypeLabel type={md.move.type} />
                            </div>

                            <span><em>{getDisplayText(md)}</em></span>
                        </div>
                    </List.Item>
                ))}
            </List>
        </div>
    )
}
