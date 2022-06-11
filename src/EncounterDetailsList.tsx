import { List } from "semantic-ui-react"

import { Encounter } from "./models/Encounter"

import { getLocationAreaName, getName, sortEncounters } from "./Helpers"

import "./EncounterDetailsList.css"

interface EncounterDetailsListProps {
    encounterDetails: Encounter[]
    versionGroupId: number | undefined
}

export const EncounterDetailsList = (props: EncounterDetailsListProps) => {
    const renderLevels = (e: Encounter) => {
        if (e.minLevel === e.maxLevel) {
            return <span>Level {e.maxLevel}</span>
        }

        return <span>Levels {e.minLevel}-{e.maxLevel}</span>
    }

    let encounterDetails = [...props.encounterDetails]
    encounterDetails.sort(sortEncounters)

    return (
        <div className="encounter-details-list">
            <List divided relaxed>
                {encounterDetails.map(e => (
                    <List.Item key={e.id}>
                        <div className="encounter-detail">
                            <div className="encounter-name-container">
                                <span>{getName(e.version)}</span>
                                <span>{getLocationAreaName(e.locationArea)}</span>
                                {renderLevels(e)}
                                <span>{e.encounterSlot.rarity}% chance</span>
                            </div>

                            <div>
                                {e.conditionValues.map(cv => (
                                    <span>{getName(cv.value)}</span>
                                ))}
                            </div>
                        </div>
                    </List.Item>
                ))}
            </List>
        </div>
    )
}
