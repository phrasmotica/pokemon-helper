import { Table } from "semantic-ui-react"

import { PokemonMove } from "./SpeciesQuery"

interface MovesTableProps {
    moves: PokemonMove[]
}

export const MovesTable = (props: MovesTableProps) => {
    const getName = (move: PokemonMove) => move.move.names[0]!.name

    let allMoves = props.moves
    let uniqueMoveNames = [...new Set(allMoves.map(getName))]

    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {uniqueMoveNames.map(n => (
                    <Table.Row>
                        <Table.Cell key={n}>{n}</Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    )
}
