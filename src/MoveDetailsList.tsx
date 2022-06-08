import { List } from "semantic-ui-react"

import { Move } from "./models/Move"

import { getDisplayText, getName, sortMoveDetails } from "./Helpers"
import { MoveInformation } from "./MoveInformation"
import { PokemonMove } from "./SpeciesQuery"
import { TypeLabel } from "./TypeLabel"

import "./MoveDetailsList.css"

interface MoveDetailsListProps {
    moveDetails: PokemonMove[]
    versionGroupId: number | undefined
}

export const MoveDetailsList = (props: MoveDetailsListProps) => {
    let moveDetails = [...props.moveDetails]
    moveDetails.sort(sortMoveDetails)

    const renderModal = (move: Move) => {
        return <MoveInformation move={move} versionGroupId={props.versionGroupId} />
    }

    return (
        <div className="move-details-list">
            <List divided relaxed>
                {moveDetails.map(md => (
                    <List.Item key={md.id}>
                        <div className="move-detail">
                            <div className="move-name-container">
                                {renderModal(md.move)}

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
