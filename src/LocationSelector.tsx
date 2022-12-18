import { useEffect, useMemo, useState } from "react"
import { Button, ButtonGroup, Checkbox, Dropdown, List, Loader, Segment } from "semantic-ui-react"

import { LocationArea } from "./models/Encounter"

import { LocationOption, sortLocationOptions, useLocationOptionsQuery } from "./queries/LocationOptionsQuery"
import { useRegionsQuery } from "./queries/RegionQuery"

import { getName, uniqueBy } from "./util/Helpers"

import "./LocationSelector.css"
import { Region } from "./models/Region"

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

    const toggleRegion = (regionId: number) => {
        if (regionsFilter.includes(regionId)) {
            setRegionsFilter(regionsFilter.filter(i => i !== regionId))
        }
        else {
            setRegionsFilter([regionId, ...regionsFilter])
        }
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

    const renderRegionCheckbox = (r: Region) => (
        <List.Item key={r.id}>
            <Checkbox
                checked={regionsFilter.includes(r.id)}
                onChange={() => toggleRegion(r.id)}
                label={getRegionName(r.name)} />
        </List.Item>
    )

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

            <div className="region-checkbox-container">
                <Segment>
                    {regions.length <= 0 && <Loader active inline="centered" />}
                    {regions.length > 0 && <List divided relaxed>
                        {regions.map(renderRegionCheckbox)}
                    </List>}
                </Segment>
            </div>
        </div>
    )
}
