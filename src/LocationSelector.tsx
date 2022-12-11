import { Button, Dropdown } from "semantic-ui-react"

import { LocationArea } from "./models/Encounter"

import { LocationOption, useLocationOptionsQuery } from "./queries/LocationOptionsQuery"

import { getName } from "./util/Helpers"

import "./LocationSelector.css"

interface LocationSelectorProps {
    location: string
    loadingLocation: boolean
    setLocation: (location: string) => void
}

export const LocationSelector = (props: LocationSelectorProps) => {
    const { loadingLocationOptions, locationOptionsData } = useLocationOptionsQuery()

    // filter locations with no encounters in all location areas
    let showLocationArea = (area: LocationArea) => area.encountersAgg.aggregate.count > 0
    let showLocation = (location: LocationOption) => location.locationAreas.some(showLocationArea)

    let options = (locationOptionsData?.locationOptions ?? []).filter(showLocation).map(s => ({
        key: s.name,
        text: getName(s),
        value: s.name,
    }))

    return (
        <div className="location-selector-container">
            <Dropdown
                fluid
                selection
                search
                className="location-input"
                loading={props.loadingLocation || loadingLocationOptions}
                placeholder="Location..."
                options={options}
                value={props.location}
                onChange={(e, data) => props.setLocation(data.value as string)} />

            <Button
                icon="cancel"
                disabled={!props.location}
                onClick={() => props.setLocation("")}  />
        </div>
    )
}