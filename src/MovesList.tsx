import { useState } from "react"
import { Accordion, Table } from "semantic-ui-react"

import { groupBy } from "./Helpers"
import { PokemonMove } from "./SpeciesQuery"

interface MovesTableProps {
    moves: PokemonMove[]
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

        accordionItems.push(
            <Accordion.Title
                key={"title" + moveId}
                className="move-header"
                active={openMoves.includes(moveId)}
                onClick={() => toggleMoveOpen(moveId)}>
                <span>{getName(moveDetails[0]!)}</span>
                <span><em>{moveDetails.length} details</em></span>
            </Accordion.Title>
        )

        accordionItems.push(
            <Accordion.Content
                key={"content" + moveId}
                className="move-content"
                active={openMoves.includes(moveId)}>
                (TODO: move details here)
            </Accordion.Content>
        )
    }

    return (
        <div className="moves-list">
            <h4>Moves</h4>

            <Accordion styled>
                {accordionItems}
            </Accordion>
        </div>
    )
}
