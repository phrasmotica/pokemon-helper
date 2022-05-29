import { useEffect, useState } from "react"

import { BasicInfo } from "./BasicInfo"
import { FormSelector } from "./FormSelector"
import { HistoryMenu } from "./HistoryMenu"
import { MovesList } from "./MovesList"
import { useSpeciesQuery } from "./SpeciesQuery"
import { SpeciesSelector } from "./SpeciesSelector"
import { StatsTable } from "./StatsTable"
import { VarietySelector } from "./VarietySelector"
import { useVersionGroupsQuery } from "./VersionGroupQuery"
import { VersionGroupSelector } from "./VersionGroupSelector"

import "./App.css"

const App = () => {
    const [varietyId, setVarietyId] = useState<number>()
    const [formId, setFormId] = useState<number>()

    const [versionGroupId, setVersionGroupId] = useState<number>()
    const [history, setHistory] = useState(["piplup"])

    const { loadingSpecies, error, speciesData, refetchSpecies } =
        useSpeciesQuery("piplup")

    useEffect(() => {
        let firstVariety = speciesData?.speciesInfo[0].varieties[0]
        if (firstVariety) {
            setVarietyId(firstVariety.id)

            let firstForm = firstVariety.forms[0]
            if (firstForm) {
                setFormId(firstForm.id)
            }
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

    let speciesInfo = loadingSpecies ? undefined : speciesData?.speciesInfo[0]

    let varieties = speciesInfo?.varieties ?? []
    let variety = varieties.find(v => v.id === varietyId)

    let forms = variety?.forms ?? []
    let form = forms.find(f => f.id === formId)

    let versionGroup = versionGroupsData?.versionGroupInfo.find(vg => vg.id === versionGroupId)

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

                        <FormSelector
                            species={speciesInfo}
                            loadingForms={loadingSpecies}
                            forms={forms}
                            form={formId}
                            setForm={setFormId} />

                        <VersionGroupSelector
                            loadingVersionGroups={loadingVersionGroups}
                            versionGroups={versionGroupsData?.versionGroupInfo ?? []}
                            versionGroupId={versionGroupId}
                            setVersionGroupId={setVersionGroupId} />
                    </div>

                    <HistoryMenu history={history} findSpecies={findSpecies} />
                </div>

                <div className="details-container">
                    <BasicInfo
                        speciesInfo={speciesInfo}
                        variety={variety}
                        form={form}
                        versionGroup={versionGroup} />

                    <StatsTable stats={stats} />

                    <MovesList moves={moves} versionGroup={versionGroupId} />
                </div>
            </div>
        </div>
    )
}

export default App
