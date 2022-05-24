import { useState } from "react"

import { useSpeciesQuery } from "./SpeciesQuery"

function App() {
    const [species, setSpecies] = useState("")

    const { loadingSpecies, error, speciesData, refetchSpecies } =
        useSpeciesQuery("floatzel")

    let speciesInfo = loadingSpecies ? undefined : speciesData!.speciesInfo[0]!
    let variety = loadingSpecies ? undefined : speciesInfo!.varieties[0]!

    let types = loadingSpecies ? [] : variety!.types
    let stats = loadingSpecies ? [] : variety!.stats

    return (
        <div className="App">
            <header className="App-header">
                <div>
                    <input onChange={(e) => setSpecies(e.target.value)}></input>
                    <button onClick={() => refetchSpecies(species)}>
                        Find
                    </button>
                </div>

                <div>
                    <p>{!loadingSpecies && speciesInfo!.names[0]!.name}</p>

                    {!loadingSpecies && (
                        <p>
                            <span>
                                {types.map((t) => t.type.name).join("-")}
                            </span>
                        </p>
                    )}

                    <div>
                        {!loadingSpecies &&
                            stats.map((s) => (
                                <div>
                                    <span>{s.stat.name}</span>:&nbsp;
                                    <span>{s.baseValue}</span>
                                </div>
                            ))}
                    </div>
                </div>
            </header>
        </div>
    )
}

export default App
