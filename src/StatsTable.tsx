import { useState } from "react"
import { Accordion, Icon, Progress, Segment } from "semantic-ui-react"

import { getName } from "./Helpers"
import { PokemonStat } from "./SpeciesQuery"

import "./StatBars.css"
import "./StatsTable.css"

interface StatsTableProps {
    stats: PokemonStat[]
}

export const StatsTable = (props: StatsTableProps) => {
    const [active, setActive] = useState(true)

    const createProgressBar = (stat: PokemonStat) => (
        <Progress
            className={"stat-bar " + stat.stat.name}
            value={stat.baseValue}
            total={255}
            progress="value" />
    )

    const createTotalProgressBar = (stats: PokemonStat[]) => {
        let statTotal = stats.map(s => s.baseValue).reduce((a, b) => a + b, 0)

        return (
            <Progress
                className="stat-bar total"
                value={statTotal}
                total={1125}
                progress="value" />
        )
    }

    const renderStats = (stats: PokemonStat[]) => (
        <Segment>
            <div className="stats-table">
                <div className="stat-headers">
                    {stats.map(s => (
                        <div key={s.id} className="stat-header">
                            <span>{getName(s.stat)}</span>
                        </div>
                    ))}

                    <div className="stat-header">
                        <em>Total</em>
                    </div>
                </div>

                <div className="stat-bars">
                    {stats.map(s => (
                        <div key={s.id} className="stat-bar">
                            {createProgressBar(s)}
                        </div>
                    ))}

                    <div className="stat-bar">
                        {createTotalProgressBar(stats)}
                    </div>
                </div>
            </div>
        </Segment>
    )

    let hasStats = props.stats.length > 0

    return (
        <Accordion className="stats-table-container">
            <Accordion.Title active={active && hasStats} onClick={() => setActive(!active)}>
                <Icon name="dropdown" />
                Stats
            </Accordion.Title>

            <Accordion.Content active={active && hasStats}>
                {hasStats && renderStats(props.stats)}
            </Accordion.Content>
        </Accordion>
    )
}
