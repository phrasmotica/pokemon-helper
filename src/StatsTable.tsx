import { Progress, Table } from "semantic-ui-react"

import { getName } from "./Helpers"
import { PokemonStat } from "./SpeciesQuery"

import "./StatBars.css"
import "./StatsTable.css"

interface StatsTableProps {
    stats: PokemonStat[]
}

export const StatsTable = (props: StatsTableProps) => {
    const createProgressBar = (stat: PokemonStat) => (
        <Progress
            className={"stat-bar " + stat.stat.name}
            value={stat.baseValue}
            total={255}
            progress="value" />
    )

    const createTotalProgressBar = () => {
        let statTotal = props.stats.map(s => s.baseValue).reduce((a, b) => a + b, 0)

        return (
            <Progress
                className="stat-bar total"
                value={statTotal}
                total={720}
                progress="value" />
        )
    }

    return (
        <div className="stats-table">
            <h4>Stats</h4>

            <Table>
                <Table.Body>
                    {props.stats.map(s => (
                        <Table.Row key={s.id}>
                            <Table.Cell className="stat-header" width={1}>
                                {getName(s.stat)}
                            </Table.Cell>

                            <Table.Cell width={4}>
                                {createProgressBar(s)}
                            </Table.Cell>
                        </Table.Row>
                    ))}

                    <Table.Row>
                        <Table.Cell className="stat-header">
                            <em>Total</em>
                        </Table.Cell>

                        <Table.Cell>
                            {createTotalProgressBar()}
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        </div>
    )
}
