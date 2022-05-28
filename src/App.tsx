import { useState } from "react"

import { BasicInfo } from "./BasicInfo"
import { HistoryMenu } from "./HistoryMenu"
import { MovesTable } from "./MovesList"
import { PokemonMove, PokemonStat, useSpeciesQuery } from "./SpeciesQuery"
import { SpeciesSelector } from "./SpeciesSelector"
import { StatsTable } from "./StatsTable"
import { useVersionGroupsQuery } from "./VersionGroupQuery"
import { VersionGroupSelector } from "./VersionGroupSelector"

import "./App.css"

const App = () => {
    const [versionGroup, setVersionGroup] = useState<number>()
    const [history, setHistory] = useState(["piplup"])

    const { loadingSpecies, error, speciesData, refetchSpecies } =
        useSpeciesQuery("piplup")

    const { loadingVersionGroups, versionGroupsError, versionGroupsData, refetchVersionGroups } =
        useVersionGroupsQuery()

    const findSpecies = (speciesName: string) => {
        refetchSpecies(speciesName)
            .then(result => {
                if (result.data?.speciesInfo[0] && !history.includes(speciesName)) {
                    setHistory([...history, speciesName])
                }
            })
    }

    let speciesInfo = speciesData?.speciesInfo[0]

    let moves: PokemonMove[] = []
    let stats: PokemonStat[] = []

    if (speciesInfo) {
        let variety = loadingSpecies ? undefined : speciesInfo!.varieties.find(v => v.isDefault)!

        moves = loadingSpecies ? [] : variety!.moves
        stats = loadingSpecies ? [] : variety!.stats
    }

    return (
        <div className="App">
            <div className="App-header">
                <div className="control-container">
                    <div className="input-container">
                        <h2>Species search</h2>

                        <SpeciesSelector
                            loadingSpecies={loadingSpecies}
                            findSpecies={findSpecies} />

                        <VersionGroupSelector
                            loadingVersionGroups={loadingVersionGroups}
                            versionGroups={versionGroupsData?.versionGroupInfo ?? []}
                            versionGroup={versionGroup}
                            setVersionGroup={setVersionGroup} />
                    </div>

                    <HistoryMenu history={history} findSpecies={findSpecies} />
                </div>

                {<div className="details-container">
                    <BasicInfo speciesInfo={speciesInfo} />
                    <StatsTable stats={stats} />
                    <MovesTable moves={moves} versionGroup={versionGroup} />
                </div>}
            </div>
        </div>
    )
}

export default App
