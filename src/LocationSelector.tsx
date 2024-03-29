import { useEffect, useMemo, useState } from "react"
import { Button, ButtonGroup, Dropdown } from "semantic-ui-react"

import { LocationArea } from "./models/Encounter"

import { LocationOption, sortLocationOptions, useLocationOptionsQuery } from "./queries/LocationOptionsQuery"
import { useRegionsQuery } from "./queries/RegionQuery"

import { getName, uniqueBy } from "./util/Helpers"

import { RegionFilterMenu } from "./RegionFilterMenu"

import "./LocationSelector.css"

interface LocationSelectorProps {
    location: string
    loadingLocation: boolean
    setLocation: (location: string) => void
}

export const LocationSelector = (props: LocationSelectorProps) => {
    const [regionsFilter, setRegionsFilter] = useState<number[]>([])

    const { loadingLocationOptions, locationOptionsData } = useLocationOptionsQuery()

    let validLocations = useMemo(() => {
        // filter locations with no encounters in all location areas
        const showLocationArea = (area: LocationArea) => area.encountersAgg.aggregate.count > 0
        const showLocation = (location: LocationOption) => location.locationAreas.some(showLocationArea)

        return (locationOptionsData?.locationOptions ?? [])
            .filter(showLocation)
            .sort(sortLocationOptions)
    }, [locationOptionsData])

    useEffect(() => {
        // deselect if the region of the selected location is filtered out
        let selected = validLocations.find(o => o.name === props.location)
        if (selected && !regionsFilter.includes(selected.region.id)) {
            props.setLocation("")
        }
    }, [props, regionsFilter, validLocations])

    let regions = useMemo(() => uniqueBy(validLocations.map(l => l.region), x => x.id), [validLocations])

    useEffect(() => {
        setRegionsFilter(regions.map(r => r.id))
    }, [regions])

    const regionIsEnabled = (location: LocationOption) => regionsFilter.includes(location.region.id)
    let filteredLocations = validLocations.filter(regionIsEnabled)

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

    let options = filteredLocations.filter(l => l.region.id).map(l => ({
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

            <RegionFilterMenu
                locations={validLocations}
                regions={regionsData?.regionInfo ?? []}
                regionsFilter={regionsFilter}
                setRegionsFilter={setRegionsFilter} />
        </div>
    )
}
