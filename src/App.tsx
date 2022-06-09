import { useEffect, useMemo, useState } from "react"
import { Accordion, Icon } from "semantic-ui-react"

import { Species } from "./models/Species"

import { useSpeciesQuery } from "./queries/SpeciesQuery"
import { useTypesQuery } from "./queries/TypeQuery"
import { useVersionGroupsQuery } from "./queries/VersionGroupQuery"

import { BasicInfo } from "./BasicInfo"
import { EfficacyList } from "./EfficacyList"
import { FormSelector } from "./FormSelector"
import { getEffectiveTypes, moveToFront, range } from "./Helpers"
import { HistoryMenu } from "./HistoryMenu"
import { MovesListing } from "./MovesListing"
import { SpeciesSelector } from "./SpeciesSelector"
import { StatsTable } from "./StatsTable"
import { VarietySelector } from "./VarietySelector"
import { VersionGroupSelector } from "./VersionGroupSelector"
import { WelcomeMessage } from "./WelcomeMessage"

import "./App.css"

const App = () => {
    const [searchActive, setSearchActive] = useState(true)

    const [speciesName, setSpeciesName] = useState("")
    const [varietyId, setVarietyId] = useState<number>()
    const [formId, setFormId] = useState<number>()
    const [versionGroupId, setVersionGroupId] = useState<number>()

    const [history, setHistory] = useState<Species[]>([])

    const { loadingSpecies, speciesData } = useSpeciesQuery(speciesName)

    let speciesInfo = loadingSpecies ? undefined : speciesData?.speciesInfo[0]

    useEffect(() => {
        if (speciesInfo) {
            setHistory(h => {
                if (!h.some(s => s.name === speciesInfo!.name)) {
                    return [speciesInfo!, ...h]
                }

                return moveToFront(h, speciesInfo!)
            })

            let firstVariety = speciesInfo.varieties[0]
            if (firstVariety) {
                setVarietyId(firstVariety.id)

                let firstForm = firstVariety.forms[0]
                if (firstForm) {
                    setFormId(firstForm.id)
                }
            }
        }
    }, [speciesData, speciesInfo])

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

    if (form?.formName === "gmax") {
        // version groups before gen 8 are invalid
        disabledVersionGroupIds = [...new Set([...disabledVersionGroupIds, ...range(1, 19)])]
    }

    if (form?.formName === "mega") {
        // version groups before gen 6 and after gen 7 are invalid
        disabledVersionGroupIds = [...new Set([...disabledVersionGroupIds, ...range(1, 14), 20])]
    }

    let versionGroup = versionGroups.find(vg => vg.id === versionGroupId)

    let effectiveTypes = getEffectiveTypes(variety, form, versionGroup)
    let moves = variety?.moves ?? []
    let stats = variety?.stats ?? []

    return (
        <div className="App">
            <div className="App-header">
                <h1>Pokémon Helper</h1>

                <div className="main-container">
                    <div className="control-container">
                        <VersionGroupSelector
                            species={speciesInfo}
                            loadingVersionGroups={loadingVersionGroups}
                            versionGroups={versionGroups}
                            versionGroupId={versionGroupId}
                            disabledVersionGroupIds={disabledVersionGroupIds}
                            setVersionGroupId={setVersionGroupId} />

                        <Accordion className="input-container">
                            <Accordion.Title
                                active={searchActive}
                                onClick={() => setSearchActive(!searchActive)}>
                                <Icon name="dropdown" />
                                Select Pokemon
                            </Accordion.Title>

                            <Accordion.Content active={searchActive}>
                                <div className="selectors-container">
                                    <SpeciesSelector
                                        species={speciesName}
                                        loadingSpecies={loadingSpecies}
                                        setSpecies={setSpeciesName} />

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
                                </div>

                                <HistoryMenu
                                    history={history}
                                    setSpecies={setSpeciesName} />
                            </Accordion.Content>
                        </Accordion>
                    </div>

                    {!speciesInfo && <WelcomeMessage />}

                    {speciesInfo && <div className="details-container">
                        <BasicInfo
                            speciesInfo={speciesInfo}
                            variety={variety}
                            form={form}
                            versionGroup={versionGroup} />

                        <div className="battle-details-container">
                            <StatsTable stats={stats} />

                            <EfficacyList
                                types={typesData?.typeInfo ?? []}
                                effectiveTypes={effectiveTypes}
                                versionGroup={versionGroup} />

                            <MovesListing moves={moves} versionGroupId={versionGroupId} />
                        </div>
                    </div>}
                </div>
            </div>

            <footer>
                <a href="https://github.com/phrasmotica/pokemon-helper/issues" target="_blank" rel="noopener noreferrer">
                    Found a bug? Report it here!
                </a>

                <a href="https://www.flaticon.com/free-icons/pokemon" title="pokemon icons">
                    Pokemon icons created by Nikita Golubev - Flaticon
                </a>
            </footer>
        </div>
    )
}

export default App
