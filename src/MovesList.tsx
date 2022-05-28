import { useState } from "react"
import { Accordion, Label } from "semantic-ui-react"

import { getVersionGroupName, groupBy } from "./Helpers"
import { PokemonMove } from "./SpeciesQuery"

import "./MovesList.css"
import { TypeLabel } from "./TypeLabel"

interface MovesTableProps {
    moves: PokemonMove[]
    versionGroup: number | undefined
}

export const MovesTable = (props: MovesTableProps) => {
    const [openMoves, setOpenMoves] = useState<number[]>([])

    const getName = (move: PokemonMove) => move.move.names[0]!.name

    let allMoves = props.moves

    let groupedMoves = groupBy(allMoves, m => m.move.name)
    let uniqueMoves = Array.from(groupedMoves.values())

    const toggleMoveOpen = (moveId: number) => {
        let newOpenMoves = [...openMoves]

        if (!newOpenMoves.includes(moveId)) {
            newOpenMoves.push(moveId)
        }
        else {
            let index = newOpenMoves.indexOf(moveId)
            newOpenMoves.splice(index, 1)
        }

        setOpenMoves(newOpenMoves)
    }

    let accordionItems = []

    for (let moveDetails of uniqueMoves) {
        let moveId = moveDetails[0]!.move.id

        let filteredMoveDetails = moveDetails
        if (props.versionGroup !== undefined) {
            filteredMoveDetails = filteredMoveDetails.filter(md => md.versionGroup.id === props.versionGroup)
        }

        if (filteredMoveDetails.length > 0) {
            let exampleMoveDetail = filteredMoveDetails[0]!
            let move = exampleMoveDetail.move

            accordionItems.push(
                <Accordion.Title
                    key={"title" + moveId}
                    className="move-header"
                    active={openMoves.includes(moveId)}
                    onClick={() => toggleMoveOpen(moveId)}>
                    <div className="move-name-container">
                        <span>{getName(exampleMoveDetail)}</span>

                        <div className="move-type">
                            <TypeLabel type={move.type} />
                        </div>
                    </div>

                    <span><em>{filteredMoveDetails.length} detail(s)</em></span>
                </Accordion.Title>
            )

            accordionItems.push(
                <Accordion.Content
                    key={"content" + moveId}
                    className="move-content"
                    active={openMoves.includes(moveId)}>
                    {filteredMoveDetails.map(md => {
                        let learnMethodText = md.learnMethod.names[0]!.name
                        if (md.learnMethod.id === 1) {
                            learnMethodText = `level ${md.level}`
                        }

                        return (
                            <div key={md.id}>
                                <span>{getVersionGroupName(md.versionGroup)}: {learnMethodText}</span>
                            </div>
                        )
                    })}
                </Accordion.Content>
            )
        }
    }

    return (
        <div className="moves-list-container">
            <h4>Moves</h4>

            <Accordion className="moves-list" styled>
                {accordionItems}
            </Accordion>
        </div>
    )
}
