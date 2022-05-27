import { useState } from "react"

import { useSpeciesQuery } from "./SpeciesQuery"

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
    let variety = loadingSpecies ? undefined : speciesInfo!.varieties[0]!

    let moves = loadingSpecies ? [] : variety!.moves
    let uniqueMoveNames = [...new Set(moves.map(m => m.move.name))]

    let types = loadingSpecies ? [] : variety!.types
    let stats = loadingSpecies ? [] : variety!.stats

    return (
        <div className="App">
            <div className="App-header">
                <div className="control-container">
                    <div className="input-container">
                        <input
                            value={species}
                            onChange={(e) => setSpecies(e.target.value)} />

                        <button onClick={() => findSpecies(species)}>
                            Find
                        </button>
                    </div>

                    <div className="history-container">
                        {history.map(s => (
                            <div key={s}>
                                <button onClick={() => findSpecies(s)}>
                                    {s}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="details-container">
                    <div>
                        <p>{!loadingSpecies && speciesInfo!.names[0]!.name}</p>

                        {!loadingSpecies && (
                            <p>
                                <span>
                                    {types.map((t) => t.type.name).join("-")}
                                </span>
                            </p>
                        )}
                    </div>

                    <div>
                        {!loadingSpecies &&
                            stats.map((s) => (
                                <div key={s.id}>
                                    <span>{s.stat.name}</span>:&nbsp;
                                    <span>{s.baseValue}</span>
                                </div>
                            ))}
                    </div>

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
