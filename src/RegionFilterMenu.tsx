import { useEffect, useMemo, useState } from "react"
import { Accordion, Icon, Label, Loader, Menu } from "semantic-ui-react"

import { Region } from "./models/Region"

import { LocationOption } from "./queries/LocationOptionsQuery"

import { getName, uniqueBy } from "./util/Helpers"

import "./RegionFilterMenu.css"

interface RegionFilterMenuProps {
    locations: LocationOption[]
    regions: Region[]
    regionsFilter: number[]
    setRegionsFilter: (filter: number[]) => void
}

export const RegionFilterMenu = (props: RegionFilterMenuProps) => {
    const [active, setActive] = useState(false)

    let regions = useMemo(() => uniqueBy(props.locations.map(l => l.region), x => x.id), [props.locations])

    let setRegionsFilter = props.setRegionsFilter

    useEffect(() => {
        setRegionsFilter(regions.map(r => r.id))
    }, [setRegionsFilter, regions])

    const getRegionName = (name: string) => {
        let region = props.regions.find(r => r.name === name)
        return region ? getName(region) : ""
    }

    const getRegionCount = (name: string) => {
        return props.locations.filter(l => l.region.name === name).length
    }

    const toggleRegion = (regionId: number) => {
        let newFilter = [...props.regionsFilter]

        let index = newFilter.indexOf(regionId)
        if (index >= 0) {
            newFilter.splice(index, 1)
        }
        else {
            newFilter.push(regionId)
        }

        props.setRegionsFilter(newFilter)
    }

    const renderRegionCheckbox = (r: Region) => {
        let active = props.regionsFilter.includes(r.id)

        let labelClassName = "region-count-label"
        if (active) {
            labelClassName += " active"
        }

        return (
            <Menu.Item
                name={r.name}
                active={active}
                onClick={() => toggleRegion(r.id)}>
                <Label className={labelClassName}>
                    {getRegionCount(r.name)}
                </Label>

                {getRegionName(r.name)}
            </Menu.Item>
        )
    }

    return (
        <Accordion className="region-filter-menu-container">
            <Accordion.Title active={active} onClick={() => setActive(!active)}>
                <Icon name="dropdown" />
                Filter by Region ({props.regionsFilter.length})
            </Accordion.Title>

            <Accordion.Content active={active}>
                <div className="region-filter-menu">
                    <Menu vertical fluid>
                        {regions.length <= 0 && <Menu.Item name="loader">
                            <Loader active inline="centered" />
                        </Menu.Item>}
                        {regions.length > 0 && regions.map(renderRegionCheckbox)}
                    </Menu>
                </div>
            </Accordion.Content>
        </Accordion>
    )
}
