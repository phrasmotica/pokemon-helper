import { List } from "semantic-ui-react"

import { Encounter } from "./models/Encounter"

import { createMergedEncounters, getLocationAreaName, getName, groupBy, sortEncounters } from "./util/Helpers"
import { Interval, isEmpty, mergeIntRanges, summarise } from "./util/Interval"

import "./EncountersList.css"

interface EncountersListProps {
    encounters: Encounter[]
    methodId: number
    captureRate: number
}

export const EncountersList = (props: EncountersListProps) => {
    const renderCaptureRate = (captureRate: number) => {
        // don't show capture rate for gift Pokemon
        if ([18, 19].includes(props.methodId)) {
            return null
        }

        return (
            <div className="capture-rate">
                <span>Catch rate: {captureRate}</span>
            </div>
        )
    }

    const renderEncountersInLocationArea = (locationAreaName: string, encounters: Encounter[]) => {
        let mergeMap = createMergedEncounters(encounters)

        return (
            <List.Item key={locationAreaName}>
                <div className="location-area-header">
                    <span>{locationAreaName}</span>
                </div>

                {mergeMap.map(renderMatchedEncounters)}
            </List.Item>
        )
    }

    const renderMatchedEncounters = (matchedEncounters: Encounter[]) => (
        <div key={matchedEncounters[0].id} className="matched-encounters">
            {renderLevels(matchedEncounters)}

            <div className="conditions">
                {renderChance(matchedEncounters)}

                {renderConditionValues(matchedEncounters)}
            </div>
        </div>
    )

    const renderLevels = (matchedEncounters: Encounter[]) => {
        let levelRanges = matchedEncounters.map(e => [e.minLevel, e.maxLevel] as Interval)
        let mergedLevelRanges = mergeIntRanges(levelRanges)
        let levelRangesText = mergedLevelRanges.map(summarise).join(", ")

        if (mergedLevelRanges.length > 1 || !isEmpty(mergedLevelRanges[0])) {
            return <span>Levels {levelRangesText}</span>
        }

        return <span>Level {levelRangesText}</span>
    }

    const renderChance = (matchedEncounters: Encounter[]) => {
        // don't show 100% chance for gift Pokemon
        let hideChance = [18, 19].includes(matchedEncounters[0].encounterSlot.method.id)
        if (hideChance) {
            return null
        }

        let chance = matchedEncounters.map(e => e.encounterSlot.rarity).reduce((a, b) => a + b)
        return <div><span>{chance}% chance</span></div>
    }

    const renderConditionValues = (matchedEncounters: Encounter[]) => {
        // only show non-default condition values
        let conditionsValuesToShow = matchedEncounters[0].conditionValues.filter(cv => !cv.value.isDefault)

        let hasConditions = conditionsValuesToShow.length > 0
        if (!hasConditions) {
            return null
        }

        let conditionsText = conditionsValuesToShow.map(cv => getName(cv.value)).join(", ")

        return (
            <div className="condition-values">
                <span>({conditionsText})</span>
            </div>
        )
    }

    let encounters = [...props.encounters]
    encounters.sort(sortEncounters)

    let groupedEncounters = groupBy(encounters, e => getLocationAreaName(e.locationArea))

    return (
        <div className="encounters-list">
            {renderCaptureRate(props.captureRate)}

            <List divided relaxed>
                {Array.from(groupedEncounters.entries()).map(
                    e => renderEncountersInLocationArea(e[0], e[1])
                )}
            </List>
        </div>
    )
}
