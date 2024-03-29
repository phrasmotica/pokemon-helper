import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { Accordion, Icon, Loader } from "semantic-ui-react"

import { Species } from "../models/Species"

import { useSpeciesQuery } from "../queries/SpeciesQuery"
import { useTypesQuery } from "../queries/TypeQuery"
import { useVersionGroupsQuery } from "../queries/VersionGroupQuery"

import { range, getEffectiveTypes, updateHistory, getLocationAreaName, getName } from "../util/Helpers"

import { AbilitiesListing } from "../AbilitiesListing"
import { BasicInfo } from "../BasicInfo"
import { CaptureLocationsListing } from "../CaptureLocationsListing"
import { EfficacyList } from "../EfficacyList"
import { FormSelector } from "../FormSelector"
import { HistoryMenu } from "../HistoryMenu"
import { MovesListing } from "../MovesListing"
import { SpeciesSelector } from "../SpeciesSelector"
import { StatsTable } from "../StatsTable"
import { VarietySelector } from "../VarietySelector"
import { VersionGroupSelector } from "../VersionGroupSelector"
import { WelcomeMessage } from "../WelcomeMessage"

import "./PokedexPage.css"

export const PokedexPage = () => {
    const [searchActive, setSearchActive] = useState(true)

    const [searchParams, setSearchParams] = useSearchParams()

    const [speciesName, setSpeciesName] = useState("")
    const [varietyId, setVarietyId] = useState<number>()
    const [formId, setFormId] = useState<number>()
    const [versionGroupId, setVersionGroupId] = useState<number>()

    const [history, setHistory] = useState<Species[]>([])

    let speciesFromParams = searchParams.get("species")

    useEffect(() => {
        if (speciesFromParams) {
            setSpeciesName(speciesFromParams)
        }
    }, [speciesFromParams])

    const { loadingSpecies, speciesData } = useSpeciesQuery(speciesName)

    let speciesInfo = loadingSpecies ? undefined : speciesData?.speciesInfo[0]

    useEffect(() => {
        if (speciesInfo) {
            setHistory(h => updateHistory(h, speciesInfo!))

            let firstVariety = speciesInfo.varieties[0]
            if (firstVariety) {
                setVarietyId(firstVariety.id)
            }
        }
    }, [speciesInfo])

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

    let versionGroupFromParams = searchParams.get("versionGroup")

    useEffect(() => {
        if (versionGroupFromParams) {
            let vgId = Number(versionGroupFromParams)

            if (versionGroups.map(vg => vg.id).includes(vgId)) {
                setVersionGroupId(vgId)
            }
        }
    }, [versionGroups, versionGroupFromParams])

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

    const renderSpeciesHistoryItem = (s: Species) => (
        <div>
            {getName(s)}&nbsp;

            <span className="species-order">
                (&#x00023;{s.order})
            </span>
        </div>
    )

    let variety = varieties.find(v => v.id === varietyId)

    let forms = variety?.forms ?? []
    let form = forms.find(f => f.id === formId)

    if (form?.formName === "gmax") {
        // version groups before gen 8 are invalid
        disabledVersionGroupIds = [...new Set([...disabledVersionGroupIds, ...range(1, 19)])]
    }

    if (form?.formName && form.formName.startsWith("mega")) {
        // version groups before gen 6 and after gen 7 are invalid
        disabledVersionGroupIds = [...new Set([...disabledVersionGroupIds, ...range(1, 14), 20])]
    }

    let versionGroup = versionGroups.find(vg => vg.id === versionGroupId)

    let effectiveTypes = getEffectiveTypes(variety, form, versionGroup)
    let moves = variety?.moves ?? []
    let stats = variety?.stats ?? []

    return (
        <div>
            <h1>Pok&eacute;dex</h1>

            <div className="main-container">
                <div className="control-container">
                    <VersionGroupSelector
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
                                    varietyId={varietyId}
                                    setVarietyId={setVarietyId} />

                                <FormSelector
                                    species={speciesInfo}
                                    loadingForms={loadingSpecies}
                                    forms={forms}
                                    formId={formId}
                                    setFormId={setFormId} />
                            </div>

                            <HistoryMenu
                                history={history}
                                renderItem={s => renderSpeciesHistoryItem(s as Species)}
                                setItem={setSpeciesName} />
                        </Accordion.Content>
                    </Accordion>
                </div>

                {!speciesInfo && !loadingSpecies && <WelcomeMessage />}

                {(speciesInfo || loadingSpecies) && <div className="details-container">
                    {loadingSpecies && <Loader active inline="centered" />}
                    {!loadingSpecies && <div>
                        <BasicInfo
                            speciesInfo={speciesInfo}
                            variety={variety}
                            form={form}
                            versionGroup={versionGroup} />

                        <div className="battle-details-container">
                            <AbilitiesListing
                                abilities={variety?.abilities ?? []}
                                versionGroup={versionGroup} />

                            <StatsTable stats={stats} />

                            <EfficacyList
                                types={typesData?.typeInfo ?? []}
                                effectiveTypes={effectiveTypes}
                                versionGroup={versionGroup} />

                            <CaptureLocationsListing
                                title="Capture Locations"
                                encounters={variety?.encounters ?? []}
                                groupBy={e => getLocationAreaName(e.locationArea)}
                                versionGroup={versionGroup}
                                captureRate={speciesInfo?.captureRate}
                                showSprites={false} />

                            <MovesListing
                                moves={moves}
                                versionGroup={versionGroup} />
                        </div>
                    </div>}
                </div>}
            </div>
        </div>
    )
}
