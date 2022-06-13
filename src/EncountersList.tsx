import { List } from "semantic-ui-react"

import { Encounter } from "./models/Encounter"

import { getLocationAreaName, getName, groupBy, sortEncounters } from "./util/Helpers"

import "./EncountersList.css"

interface EncountersListProps {
    encounters: Encounter[]
}

export const EncountersList = (props: EncountersListProps) => {
    const renderEncountersInLocationArea = (locationAreaName: string, encounters: Encounter[]) => {
        return (
            <List.Item key={locationAreaName}>
                <div className="location-area-header">
                    <span>{locationAreaName}</span>
                </div>

                {encounters.map(renderEncounter)}
            </List.Item>
        )
    }

    const renderEncounter = (e: Encounter) => (
        <div className="encounter">
            <div className="encounter-name-container">
                {renderLevels(e)}
                <span>{e.encounterSlot.rarity}% chance</span>
            </div>

            <div className="encounter-condition-values">
                {e.conditionValues.map(cv => (
                    <span>{getName(cv.value)}</span>
                ))}
            </div>
        </div>
    )

    const renderLevels = (e: Encounter) => {
        if (e.minLevel === e.maxLevel) {
            return <span>Level {e.maxLevel}</span>
        }

        return <span>Levels {e.minLevel}-{e.maxLevel}</span>
    }

    let encounters = [...props.encounters]
    encounters.sort(sortEncounters)

    let groupedEncounters = groupBy(encounters, e => getLocationAreaName(e.locationArea))

    return (
        <div className="encounters-list">
            <List divided relaxed>
                {Array.from(groupedEncounters.entries()).map(
                    e => renderEncountersInLocationArea(e[0], e[1])
                )}
            </List>
        </div>
    )
}
