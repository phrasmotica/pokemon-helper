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

    const getEncountersWithMethod = (encounters: Encounter[], methodId: number) => (
        encounters.filter(e => e.encounterSlot.method.id === methodId)
    )

    let validEncounters = props.encounters.filter(isValidEncounter)

    let encounterMethods = uniqueBy(validEncounters, ed => ed.encounterSlot.method.id).map(ed => ed.encounterSlot.method)
    encounterMethods.sort(sortById)

    const panes = encounterMethods.map(em => ({
        menuItem: getName(em),
        render: () => <Tab.Pane className="encounters-list-container">
            <EncountersList
                key={em.name}
                encounters={getEncountersWithMethod(validEncounters, em.id)}
                versionGroupId={props.versionGroup?.id} />
        </Tab.Pane>,
    }))

    let content = <Tab menu={{ pointing: true, }} panes={panes} />

    if (validEncounters.length <= 0) {
        content = <Segment><span>No locations to show!</span></Segment>
    }

    // TODO: add secondary detached menu for selecting which version to view
    // encounters for

    return (
        <Accordion className="capture-locations-listing-container">
            <Accordion.Title active={active} onClick={() => setActive(!active)}>
                <Icon name="dropdown" />
                Capture Locations
            </Accordion.Title>

            <Accordion.Content active={active}>
                {content}
            </Accordion.Content>
        </Accordion>
    )
}
