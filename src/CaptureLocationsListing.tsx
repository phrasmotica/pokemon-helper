import { useState } from "react"
import { Accordion, Icon, Segment, Tab } from "semantic-ui-react"

import { Encounter } from "./models/Encounter"
import { VersionGroup } from "./models/VersionGroup"

import { EncountersList } from "./EncountersList"
import { getName, sortById, uniqueBy } from "./Helpers"

import "./CaptureLocationsListing.css"

interface CaptureLocationsListingProps {
    encounters: Encounter[]
    versionGroup: VersionGroup | undefined
}

export const CaptureLocationsListing = (props: CaptureLocationsListingProps) => {
    const [active, setActive] = useState(true)

    let hasEncounters = props.encounters.length > 0
    if (!hasEncounters) {
        return null
    }

    const isValidEncounter = (e: Encounter) => {
        let versions = props.versionGroup?.versions ?? []
        return versions.map(v => v.id).includes(e.version.id)
    }

    const getEncountersWithVersion = (encounters: Encounter[], versionId: number) => (
        encounters.filter(e => e.version.id === versionId)
    )

    const getEncountersWithMethod = (encounters: Encounter[], methodId: number) => (
        encounters.filter(e => e.encounterSlot.method.id === methodId)
    )

    const renderMethodMenu = (encounters: Encounter[]) => {
        const methodPanes = encounterMethods.map(em => ({
            menuItem: getName(em),
            render: () => <Tab.Pane className="encounters-list-container">
                <EncountersList
                    key={em.name}
                    encounters={getEncountersWithMethod(encounters, em.id)} />
            </Tab.Pane>,
        }))

        return <Tab menu={{ pointing: true, }} panes={methodPanes} />
    }

    let validEncounters = props.encounters.filter(isValidEncounter)

    let encounterMethods = uniqueBy(validEncounters, ed => ed.encounterSlot.method.id).map(ed => ed.encounterSlot.method)
    encounterMethods.sort(sortById)

    let versions = uniqueBy(validEncounters, e => e.version.id).map(e => e.version)
    versions.sort(sortById)

    const versionPanes = versions.map(v => ({
        menuItem: getName(v),
        render: () => renderMethodMenu(getEncountersWithVersion(validEncounters, v.id)),
    }))

    let versionMenu = <Tab menu={{ inverted: true, secondary: true, pointing: true, }} panes={versionPanes} />

    if (validEncounters.length <= 0) {
        versionMenu = <Segment><span>No locations to show!</span></Segment>
    }

    return (
        <Accordion className="capture-locations-listing-container">
            <Accordion.Title active={active} onClick={() => setActive(!active)}>
                <Icon name="dropdown" />
                Capture Locations
            </Accordion.Title>

            <Accordion.Content active={active}>
                {versionMenu}
            </Accordion.Content>
        </Accordion>
    )
}
