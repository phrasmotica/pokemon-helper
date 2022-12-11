import { useState, useEffect, useMemo } from "react"
import { Accordion, Icon } from "semantic-ui-react"

import { Encounter } from "../models/Encounter"
import { Location } from "../models/Location"
import { hasEncounters } from "../models/VersionGroup"

import { useLocationQuery } from "../queries/LocationQuery"
import { useVersionGroupsQuery } from "../queries/VersionGroupQuery"

import { getName, groupBy, updateHistory } from "../util/Helpers"

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

    const getEncounters = () => {
        if (!locationInfo) {
            return []
        }

        return locationInfo.areas.flatMap(a => a.encounters)
    }

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

    const renderEncounters = (encounters: Encounter[]) => {
        let groupedEncounters = groupBy(encounters, e => getName(e.locationArea))
        let showTitles = groupedEncounters.size > 1

        return (
            <div>
                {Array.from(groupedEncounters.entries()).map(
                    g => <CaptureLocationsListing
                        encounters={g[1]}
                        versionGroup={versionGroup}
                        groupBy={e => e.pokemon.name} // TODO: group by localised name. Create GraphQL query for getting name of a species/variety/form
                        title={showTitles ? g[0] : undefined} />
                )}
            </div>
        )
    }

    const renderLocationHistoryItem = (l: Location) => <div>{getName(l)}</div>

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

                {!locationInfo && <RouteDexWelcomeMessage />}

                {locationInfo && <div className="details-container">
                    {renderEncounters(encounters)}
                </div>}
            </div>
        </div>
    )
}
