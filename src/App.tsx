import { useEffect, useState } from "react"
import { Button, Input, Menu } from "semantic-ui-react"

import { useSpeciesQuery } from "./SpeciesQuery"

import "./App.css"
import { StatsTable } from "./StatsTable"
import { BasicInfo } from "./BasicInfo"

const history = ["piplup"]

const App = () => {
    const [species, setSpecies] = useState("")

    const { loadingSpecies, error, speciesData, refetchSpecies } =
        useSpeciesQuery("piplup")

    const findSpecies = (speciesName: string) => {
        if (!history.includes(speciesName)) {
            history.push(speciesName)
        }

        refetchSpecies(speciesName)
    }

    let speciesInfo = loadingSpecies ? undefined : speciesData!.speciesInfo[0]!
    let variety = loadingSpecies ? undefined : speciesInfo!.varieties[0]!

    let moves = loadingSpecies ? [] : variety!.moves
    let uniqueMoveNames = [...new Set(moves.map(m => m.move.names[0]!.name))]

    let types = loadingSpecies ? [] : variety!.types
    let typeStr = types.map(t => t.type.names[0]!.name).join("-")

    let stats = loadingSpecies ? [] : variety!.stats

    return (
        <div className="App">
            <div className="App-header">
                <div className="control-container">
                    <div className="input-container">
                        <h2>Species search</h2>

                        <Input
                            action={<Button onClick={() => findSpecies(species)}>
                                Find
                            </Button>}
                            placeholder="Search..."
                            loading={loadingSpecies}
                            value={species}
                            onChange={(e, data) => setSpecies(data.value)} />
                    </div>

                    <div className="history-container">
                        <h4>History</h4>

                        <Menu vertical>
                            {history.map(s => (
                                <Menu.Item key={s} onClick={() => findSpecies(s)}>
                                    {s}
                                </Menu.Item>
                            ))}
                        </Menu>
                    </div>
                </div>

                <div className="details-container">
                    {!loadingSpecies && <BasicInfo speciesInfo={speciesInfo!} />}

                    {!loadingSpecies && <StatsTable stats={stats} />}

                    <div>
                        {!loadingSpecies &&
                            uniqueMoveNames.map(n => (
                                <div key={n}>
                                    <span>{n}</span>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App
