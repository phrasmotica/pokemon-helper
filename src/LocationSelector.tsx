import { Button, Dropdown } from "semantic-ui-react"

import { LocationArea } from "./models/Encounter"

import { LocationOption, sortLocationOptions, useLocationOptionsQuery } from "./queries/LocationOptionsQuery"
import { useRegionsQuery } from "./queries/RegionQuery"

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

    let validLocations = (locationOptionsData?.locationOptions ?? [])
        .filter(showLocation)
        .sort(sortLocationOptions)

    // TODO: move this logic into a common file
    const { loadingRegions, regionsData } = useRegionsQuery()

    const getRegionName = (name: string) => {
        let regions = regionsData?.regionInfo ?? []
        let region = regions.find(r => r.name === name)
        return region ? getName(region) : ""
    }

    const getText = (l: LocationOption) => {
        let text = getName(l)

        if (!loadingRegions) {
            text += ` (${getRegionName(l.region.name)})`
        }

        return text
    }

    let options = validLocations.map(l => ({
        key: l.name,
        text: getText(l),
        value: l.name,
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
