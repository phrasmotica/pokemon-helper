import { Table } from "semantic-ui-react"

import { PokemonStat } from "./SpeciesQuery"

interface StatsTableProps {
    stats: PokemonStat[]
}

export const StatsTable = (props: StatsTableProps) => {
    const getName = (stat: PokemonStat) => stat.stat.names[0]!.name

    return (
        <div className="stats-table">
            <h4>Stats</h4>

            <Table>
                <Table.Header>
                    <Table.Row>
                        {props.stats.map(s => <Table.HeaderCell key={s.id}>{getName(s)}</Table.HeaderCell>)}
                        <Table.HeaderCell>Total</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    <Table.Row>
                        {props.stats.map(s => <Table.Cell key={s.id}>{s.baseValue}</Table.Cell>)}
                        <Table.Cell>{props.stats.map(s => s.baseValue).reduce((a, b) => a + b, 0)}</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        </div>
    )
}
