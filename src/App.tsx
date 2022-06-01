import { useEffect, useMemo, useState } from "react"
import { Accordion, Icon } from "semantic-ui-react"

import { BasicInfo } from "./BasicInfo"
import { EfficacyList } from "./EfficacyList"
import { FormSelector } from "./FormSelector"
import { getEffectiveTypes } from "./Helpers"
import { HistoryMenu } from "./HistoryMenu"
import { MovesList } from "./MovesList"
import { Species, useSpeciesQuery } from "./SpeciesQuery"
import { SpeciesSelector } from "./SpeciesSelector"
import { StatsTable } from "./StatsTable"
import { useTypesQuery } from "./TypeQuery"
import { VarietySelector } from "./VarietySelector"
import { useVersionGroupsQuery } from "./VersionGroupQuery"
import { VersionGroupSelector } from "./VersionGroupSelector"

import "./App.css"

const App = () => {
    const [searchActive, setSearchActive] = useState(true)

    const [varietyId, setVarietyId] = useState<number>()
    const [formId, setFormId] = useState<number>()
    const [versionGroupId, setVersionGroupId] = useState<number>()

    const [history, setHistory] = useState<Species[]>([])

    const { loadingSpecies, speciesData, refetchSpecies } = useSpeciesQuery("piplup")

    let speciesInfo = loadingSpecies ? undefined : speciesData?.speciesInfo[0]

    useEffect(() => {
        if (speciesInfo && !history.some(s => s.name === speciesInfo!.name)) {
            setHistory([...history, speciesInfo])
        }

        let firstVariety = speciesInfo?.varieties[0]
        if (firstVariety) {
            setVarietyId(firstVariety.id)

            let firstForm = firstVariety.forms[0]
            if (firstForm) {
                setFormId(firstForm.id)
            }
        }
    }, [speciesData, history, speciesInfo])

    let varieties = useMemo(() => speciesInfo?.varieties ?? [], [speciesInfo])

    useEffect(() => {
        let variety = varieties.find(v => v.id === varietyId)
        let firstForm = variety?.forms[0]
        if (firstForm) {
            setFormId(firstForm.id)
        }
    }, [varietyId, varieties])

    const { loadingVersionGroups, versionGroupsData } = useVersionGroupsQuery()

    let versionGroups = useMemo(() => versionGroupsData?.versionGroupInfo ?? [], [versionGroupsData])
    let disabledVersionGroups = speciesInfo ? versionGroups.filter(vg => vg.generation.id < speciesInfo!.generation.id) : []
    let disabledVersionGroupIds = disabledVersionGroups.map(vg => vg.id)

    useEffect(() => {
        let firstVersionGroup = versionGroupsData?.versionGroupInfo[0]
        if (firstVersionGroup) {
            setVersionGroupId(firstVersionGroup.id)
        }
    }, [versionGroupsData])

    useEffect(() => {
        if (speciesInfo && versionGroups) {
            // ensure a valid version group is selected
            if (versionGroupId && disabledVersionGroupIds.includes(versionGroupId)) {
                let newVersionGroupId = versionGroups.find(vg => !disabledVersionGroupIds.includes(vg.id))?.id
                setVersionGroupId(newVersionGroupId)
            }
        }
    }, [speciesInfo, versionGroupsData, disabledVersionGroupIds, versionGroupId, versionGroups])

    const { typesData } = useTypesQuery()

    let variety = varieties.find(v => v.id === varietyId)

    let forms = variety?.forms ?? []
    let form = forms.find(f => f.id === formId)

    let versionGroup = versionGroupsData?.versionGroupInfo.find(vg => vg.id === versionGroupId)

    let effectiveTypes = getEffectiveTypes(variety, form, versionGroup)
    let moves = variety?.moves ?? []
    let stats = variety?.stats ?? []

    return (
        <div className="App">
            <div className="App-header">
                <h1>Pokémon Helper</h1>

                <div className="main-container">
                    <div className="control-container">
                        <Accordion className="input-container">
                            <Accordion.Title
                                active={searchActive}
                                onClick={() => setSearchActive(!searchActive)}>
                                <Icon name="dropdown" />
                                Search
                            </Accordion.Title>

                            <Accordion.Content active={searchActive}>
                                <div className="selectors-container">
                                    <SpeciesSelector
                                        species={speciesInfo}
                                        loadingSpecies={loadingSpecies}
                                        findSpecies={refetchSpecies} />

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
                                        species={speciesInfo}
                                        loadingVersionGroups={loadingVersionGroups}
                                        versionGroups={versionGroupsData?.versionGroupInfo ?? []}
                                        versionGroupId={versionGroupId}
                                        disabledVersionGroupIds={disabledVersionGroupIds}
                                        setVersionGroupId={setVersionGroupId} />
                                </div>

                                <HistoryMenu
                                    history={history}
                                    findSpecies={refetchSpecies} />
                            </Accordion.Content>
                        </Accordion>
                    </div>

                    <div className="details-container">
                        <BasicInfo
                            speciesInfo={speciesInfo}
                            variety={variety}
                            form={form}
                            versionGroup={versionGroup} />

                        <div className="battle-details-container">
                            <StatsTable stats={stats} />

                            <EfficacyList types={typesData?.typeInfo ?? []} effectiveTypes={effectiveTypes} />

                            <MovesList moves={moves} versionGroupId={versionGroupId} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App
