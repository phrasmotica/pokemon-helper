import { Table } from "semantic-ui-react"

import { groupBy } from "./Helpers"
import { PokemonMove } from "./SpeciesQuery"

interface MovesTableProps {
    moves: PokemonMove[]
}

export const MovesTable = (props: MovesTableProps) => {
    const getName = (move: PokemonMove) => move.move.names[0]!.name

    let allMoves = props.moves

    let groupedMoves = groupBy(allMoves, m => m.move.name)
    let uniqueMoves = Array.from(groupedMoves.values())

    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {uniqueMoves.map(arr => (
                    <Table.Row key={arr[0]!.id}>
                        <Table.Cell>
                            <div className="move-header">
                                <span>{getName(arr[0]!)}</span>
                                <span><em>{arr.length} learn methods</em></span>
                            </div>
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    )
}
