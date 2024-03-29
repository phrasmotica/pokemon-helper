import { List } from "semantic-ui-react"

import { Encounter } from "./models/Encounter"
import { VersionGroup } from "./models/VersionGroup"

import { createMergedEncounters, getName, groupBy, sortEncounters } from "./util/Helpers"
import { Interval, isEmpty, mergeIntRanges, summarise } from "./util/Interval"

import { Sprite } from "./Sprite"

import "./EncountersList.css"

interface EncountersListProps {
    versionGroup: VersionGroup
    encounters: Encounter[]
    groupBy: (e: Encounter) => string
    methodId: number
    captureRate?: number
    showSprites?: boolean
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

    const renderEncounters = (header: string, encounters: Encounter[]) => {
        let mergeMap = createMergedEncounters(encounters)

        // TODO: refactor this component so that it's easier to render
        // encounters in different ways depending on how they're grouped?
        let headerElem = <span>{header}</span>

        let pokemon = encounters[0].pokemon
        if (pokemon) {
            let link = `/?species=${encounters[0].pokemon.species.name}&versionGroup=${props.versionGroup.id}`
            headerElem = <span><a href={link}>{header}</a></span>
        }

        return (
            <List.Item key={header}>
                <div className="encounters-header">
                    {headerElem}

                    {props.showSprites && <Sprite
                        pokemon={pokemon}
                        showShinyToggle={false} />}
                </div>

                <div>
                    {mergeMap.map(renderMatchedEncounters)}
                </div>
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

        // don't show >100% chance for multiple Devon Scope encounters, show
        // number of encounters instead
        let isDevonScope = matchedEncounters[0].encounterSlot.method.id === 30
        if (isDevonScope) {
            return <div><span>{matchedEncounters.length} encounter(s)</span></div>
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

    let groupedEncounters = groupBy(encounters, props.groupBy)

    return (
        <div className="encounters-list">
            {props.captureRate && renderCaptureRate(props.captureRate)}

            <List divided relaxed>
                {Array.from(groupedEncounters.entries()).map(
                    e => renderEncounters(e[0], e[1])
                )}
            </List>
        </div>
    )
}
