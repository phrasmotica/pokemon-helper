import { Button, ButtonGroup, Dropdown } from "semantic-ui-react"

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

    const previousLocation = () => {
        let currentIndex = options.findIndex(e => e.value === props.location)
        let newIndex = (currentIndex - 1) % options.length
        let newLocation = options[newIndex].value
        props.setLocation(newLocation)
    }

    const nextLocation = () => {
        let currentIndex = options.findIndex(e => e.value === props.location)
        let newIndex = (currentIndex + 1) % options.length
        let newLocation = options[newIndex].value
        props.setLocation(newLocation)
    }

    return (
        <div className="location-selector-container">
            <div className="location-selector-dropdown-container">
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

            <div>
                <ButtonGroup fluid>
                    <Button
                        icon="arrow left"
                        color="red"
                        onClick={previousLocation} />

                    <Button
                        icon="arrow right"
                        color="violet"
                        onClick={nextLocation} />
                </ButtonGroup>
            </div>
        </div>
    )
}
