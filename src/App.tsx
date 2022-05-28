import { useState } from "react"
import { Button, Input, Menu } from "semantic-ui-react"

import { BasicInfo } from "./BasicInfo"
import { MovesTable } from "./MovesTable"
import { useSpeciesQuery } from "./SpeciesQuery"
import { StatsTable } from "./StatsTable"

import "./App.css"

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
    let variety = loadingSpecies ? undefined : speciesInfo!.varieties.find(v => v.isDefault)!

    let moves = loadingSpecies ? [] : variety!.moves
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

                        <Menu vertical fluid>
                            {history.map(s => (
                                <Menu.Item key={s} onClick={() => findSpecies(s)}>
                                    {s}
                                </Menu.Item>
                            ))}
                        </Menu>
                    </div>
                </div>

                {!loadingSpecies && <div className="details-container">
                    <BasicInfo speciesInfo={speciesInfo!} />
                    <StatsTable stats={stats} />
                    <MovesTable moves={moves} />
                </div>}
            </div>
        </div>
    )
}

export default App
