import { useState, useEffect, useMemo } from "react"
import { Accordion, Icon, Loader } from "semantic-ui-react"

import { Encounter } from "../models/Encounter"
import { Location } from "../models/Location"
import { hasEncounters } from "../models/VersionGroup"

import { useLocationQuery } from "../queries/LocationQuery"
import { useRegionsQuery } from "../queries/RegionQuery"
import { useSpeciesNamesQuery } from "../queries/SpeciesNameQuery"
import { useVersionGroupsQuery } from "../queries/VersionGroupQuery"

import { getName, getVarietyName, groupBy, updateHistory } from "../util/Helpers"

import { CaptureLocationsListing } from "../CaptureLocationsListing"
import { HistoryMenu } from "../HistoryMenu"
import { LocationSelector } from "../LocationSelector"
import { VersionGroupSelector } from "../VersionGroupSelector"
import { RouteDexWelcomeMessage } from "../WelcomeMessage"

export const RouteDexPage = () => {
    const [searchActive, setSearchActive] = useState(true)

    const [locationName, setLocationName] = useState<string>()
    const [versionGroupId, setVersionGroupId] = useState<number>()

    const [history, setHistory] = useState<Location[]>([])

    const { loadingLocation, locationData } = useLocationQuery(locationName ?? "")

    let locationInfo = loadingLocation ? undefined : locationData?.locationInfo[0]

    useEffect(() => {
        if (locationInfo) {
            setHistory(h => updateHistory(h, locationInfo!))
        }
    }, [locationInfo])

    const getEncounters = () => (locationInfo?.areas ?? []).flatMap(a => a.encounters)

    let encounters = useMemo(getEncounters, [locationInfo])

    const { loadingVersionGroups, versionGroupsData } = useVersionGroupsQuery()

    let versionGroups = useMemo(() => versionGroupsData?.versionGroupInfo ?? [], [versionGroupsData])
    let versionGroup = versionGroups.find(vg => vg.id === versionGroupId)

    let disabledVersionGroups = versionGroups.filter(vg => !hasEncounters(vg, encounters))
    let disabledVersionGroupIds = disabledVersionGroups.map(vg => vg.id)

    useEffect(() => {
        let firstVersionGroup = versionGroupsData?.versionGroupInfo[0]
        if (firstVersionGroup) {
            setVersionGroupId(firstVersionGroup.id)
        }
    }, [versionGroupsData])

    useEffect(() => {
        if (locationInfo && versionGroups) {
            // ensure a valid version group is selected
            if (versionGroupId && disabledVersionGroupIds.includes(versionGroupId)) {
                let newVersionGroupId = versionGroups.find(vg => !disabledVersionGroupIds.includes(vg.id))?.id
                setVersionGroupId(newVersionGroupId)
            }
        }
    }, [locationInfo, versionGroupsData, disabledVersionGroupIds, versionGroupId, versionGroups])

    const { loadingSpeciesNames, speciesNamesData } = useSpeciesNamesQuery()

    const getPokemonName = (pokemonName: string) => {
        if (loadingSpeciesNames) {
            return pokemonName
        }

        let speciesNames = speciesNamesData?.speciesNameInfo ?? []
        let species = speciesNames.find(s => s.varieties.map(v => v.name).includes(pokemonName))

        if (!species) {
            return pokemonName
        }

        let variety = species.varieties.find(v => v.name === pokemonName)!
        if (variety.isDefault) {
            return getName(species)
        }

        // we do not have form information in encounter data, so variety name is good enough
        return getName(species) + ` (${getVarietyName(variety)})`
    }

    const renderEncounters = (encounters: Encounter[]) => {
        let groupedEncounters = groupBy(encounters, e => getName(e.locationArea))
        let showTitles = groupedEncounters.size > 1

        return (
            <div>
                {Array.from(groupedEncounters.entries()).map(
                    g => <CaptureLocationsListing
                        key={g[0]}
                        title={showTitles ? g[0] : undefined}
                        encounters={g[1]}
                        versionGroup={versionGroup}
                        groupBy={e => getPokemonName(e.pokemon.name)}
                        showSprites={true} />
                )}
            </div>
        )
    }

    // TODO: move this logic into a common file
    const { loadingRegions, regionsData } = useRegionsQuery()

    const getRegionName = (name: string) => {
        let regions = regionsData?.regionInfo ?? []
        let region = regions.find(r => r.name === name)
        return region ? getName(region) : ""
    }

    const getText = (l: Location) => {
        let text = getName(l)

        if (!loadingRegions) {
            text += ` (${getRegionName(l.region.name)})`
        }

        return text
    }

    const renderLocationHistoryItem = (l: Location) => <div>{getText(l)}</div>

    return (
        <div>
            <h1>RouteDex</h1>

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
                            Select Location
                        </Accordion.Title>

                        <Accordion.Content active={searchActive}>
                            <div className="selectors-container">
                                <LocationSelector
                                    location={locationName ?? ""}
                                    loadingLocation={loadingLocation}
                                    setLocation={setLocationName} />
                            </div>

                            <HistoryMenu
                                history={history}
                                renderItem={l => renderLocationHistoryItem(l as Location)}
                                setItem={setLocationName} />
                        </Accordion.Content>
                    </Accordion>
                </div>

                {!locationInfo && !loadingLocation && <RouteDexWelcomeMessage />}

                {(locationInfo || loadingLocation) && <div className="details-container">
                    {loadingLocation && <Loader active inline="centered" />}
                    {!loadingLocation && renderEncounters(encounters)}
                </div>}
            </div>
        </div>
    )
}
