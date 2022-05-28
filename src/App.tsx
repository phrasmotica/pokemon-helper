import { useEffect, useState } from "react"

import { BasicInfo } from "./BasicInfo"
import { HistoryMenu } from "./HistoryMenu"
import { MovesTable } from "./MovesList"
import { useSpeciesQuery } from "./SpeciesQuery"
import { SpeciesSelector } from "./SpeciesSelector"
import { StatsTable } from "./StatsTable"
import { VarietySelector } from "./VarietySelector"
import { useVersionGroupsQuery } from "./VersionGroupQuery"
import { VersionGroupSelector } from "./VersionGroupSelector"

import "./App.css"

const App = () => {
    const [varietyId, setVarietyId] = useState<number>()

    const [versionGroup, setVersionGroup] = useState<number>()
    const [history, setHistory] = useState(["piplup"])

    const { loadingSpecies, error, speciesData, refetchSpecies } =
        useSpeciesQuery("piplup")

    useEffect(() => {
        let firstVariety = speciesData?.speciesInfo[0].varieties[0]
        if (firstVariety) {
            setVarietyId(firstVariety.id)
        }
    }, [speciesData])

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
    let varieties = speciesInfo?.varieties ?? []

    let variety = loadingSpecies ? undefined : varieties.find(v => v.id === varietyId)!

    let moves = variety?.moves ?? []
    let stats = variety?.stats ?? []

    return (
        <div className="App">
            <div className="App-header">
                <div className="control-container">
                    <div className="input-container">
                        <h2>Species search</h2>

                        <SpeciesSelector
                            loadingSpecies={loadingSpecies}
                            findSpecies={findSpecies} />

                        <VarietySelector
                            species={speciesInfo}
                            loadingVarieties={loadingSpecies}
                            varieties={varieties}
                            variety={varietyId}
                            setVariety={setVarietyId} />

                        <VersionGroupSelector
                            loadingVersionGroups={loadingVersionGroups}
                            versionGroups={versionGroupsData?.versionGroupInfo ?? []}
                            versionGroup={versionGroup}
                            setVersionGroup={setVersionGroup} />
                    </div>

                    <HistoryMenu history={history} findSpecies={findSpecies} />
                </div>

                <div className="details-container">
                    <BasicInfo speciesInfo={speciesInfo} variety={variety} />
                    <StatsTable stats={stats} />
                    <MovesTable moves={moves} versionGroup={versionGroup} />
                </div>
            </div>
        </div>
    )
}

export default App
