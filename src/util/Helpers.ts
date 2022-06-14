import { Ability } from "../models/Ability"
import { Encounter, LocationArea } from "../models/Encounter"
import { FlavourText, VersionFlavourText } from "../models/FlavourText"
import { Generation } from "../models/Generation"
import { Name } from "../models/Name"
import { PokemonForm } from "../models/PokemonForm"
import { Species } from "../models/Species"
import { PokemonMove, Variety } from "../models/Variety"
import { VersionGroup } from "../models/VersionGroup"

/**
 * Returns an array of consecutive integers of a given length.
 * Taken from https://stackoverflow.com/a/29559488
 */
export const range = (start: number, length: number) => Array(length).fill(0).map((_, i) => i + start)

/**
 *
 */
export const min = (...arr: number[]) => {
    let min = null

    for (let i = 0; i < arr.length; i++) {
        if (min === null || arr[i] < min) {
            min = arr[i]
        }
    }

    return min
}

/**
 *
 */
export const minBy = <T>(arr: T[], func: (x: T) => number) => {
    let sortedArr = [...arr]
    sortedArr.sort((a, b) => func(a) - func(b))
    return sortedArr[0]
}

/**
 * Groups elements of the given array by the given key function, and returns the
 * grouping as a Map<string, T[]>.
 * Taken from https://stackoverflow.com/a/47752730
 */
export const groupBy = <T>(arr: T[], func: (x: T) => string) => arr.reduce(
    (entryMap, e) => entryMap.set(func(e), [...entryMap.get(func(e)) || [], e]),
    new Map<string, T[]>()
)

/**
 * Returns values in the given array that are unique based on the given key function.
 * Taken from https://stackoverflow.com/a/58429784
 */
export const uniqueBy = <T>(arr: T[], func: (x: T) => string | number) => [
    ...new Map(arr.map(x => [func(x), x])).values()
]

/**
 * Moves the given element of the given array to the start of the array.
 */
export const moveToFront = <T>(arr: T[], elem: T) => {
    let newArr = [...arr]

    let index = newArr.indexOf(elem)
    if (index > 0) {
        newArr.splice(index, 1)
        newArr.unshift(elem)
    }

    return newArr
}

export const getGenus = (x: Species) => x.names[0]!.genus

export const getName = (x: { names: Name[] }) => x.names[0]?.name ?? ""

export const getShortEffect = (a: Ability) => a.descriptions[0]?.shortEffect ?? ""

/**
 * Removes unnecessary spacing and newline characters from the given string.
 * \u00AD (&shy;) replacement taken from https://stackoverflow.com/a/34838501
 */
const clean = (str: string) => str
    .replaceAll("\n", " ")
    .replaceAll("\f", " ")
    .replaceAll("- ", "-")
    .replaceAll("\u00AD ", "")

export const getFlavourText = (x: { flavourTexts: FlavourText[] }, versionGroupId: number | undefined) => {
    if (!versionGroupId) {
        return "Please select a version group!"
    }

    let index = Math.max(x.flavourTexts.findIndex(ft => ft.versionGroup.id === versionGroupId), 0)
    return getCleanFlavourText(x.flavourTexts[index])
}

export const getCleanFlavourText = (ft: FlavourText | VersionFlavourText | undefined) => {
    let rawText = ft?.text ?? "(no flavour text available)"
    return clean(rawText)
}

export const getVarietyName = (v: Variety) => {
    let formName = ""

    let form = v.forms[0]!
    if (form.formName.length > 0) {
        formName = getName(form) || form.name
    }

    return formName
}

export const getVersionGroupName = (versionGroup: VersionGroup) => versionGroup.versions.map(getName).join("/")

export const getLocationAreaName = (la: LocationArea) => {
    let locationAreaName = getName(la)
    if (locationAreaName.length > 0) {
        return getName(la.location) + ` (${locationAreaName})`
    }

    return getName(la.location)
}

export const getDisplayText = (md: PokemonMove) => {
    let learnMethodText = getName(md.learnMethod)
    if (md.learnMethod.id === 1) {
        learnMethodText = `Level ${md.level}`
    }

    return learnMethodText
}

/**
 * Returns the effective type of a Pokemon in the given version group.
 */
export const getEffectiveTypes = (variety: Variety | undefined, form: PokemonForm | undefined, versionGroup: VersionGroup | undefined) => {
    if (!variety || !form) {
        return []
    }

    let effectiveTypes = variety.types.map(t => t.type)

    let generationId = versionGroup?.generation.id
    if (generationId) {
        let pastTypesInGenerationOrder = [...variety.pastTypes]
        pastTypesInGenerationOrder.sort((a, b) => a.generation.id - b.generation.id)

        let relevantGenerationId = pastTypesInGenerationOrder.find(pt => pt.generation.id >= generationId!)?.generation.id
        if (relevantGenerationId) {
            let relevantEntries = pastTypesInGenerationOrder.filter(pt => pt.generation.id === relevantGenerationId)
            effectiveTypes = relevantEntries.map(e => e.type)
        }
    }

    if (form.types.length > 0) {
        effectiveTypes = form.types.map(t => t.type)
    }

    return effectiveTypes
}

/**
 * Sorts the given moves by their details in a lexicographical fashion.
 */
export const sortMoves = (m1: PokemonMove[], m2: PokemonMove[]) => {
    for (let i = 0; i < (min(m1.length, m2.length) ?? 0); i++) {
        let comp = sortMoveDetails(m1[i], m2[i])
        if (comp !== 0) {
            return comp
        }
    }

    return 0
}

/**
 * Sorts the given encounters.
 */
export const sortEncounters = (e1: Encounter, e2: Encounter) => {
    if (e1.version.id !== e2.version.id) {
        return e1.version.id - e2.version.id
    }

    if (e1.encounterSlot.method.id !== e2.encounterSlot.method.id) {
        return e1.encounterSlot.method.id - e2.encounterSlot.method.id
    }

    if (e1.locationArea.location.id !== e2.locationArea.location.id) {
        return e1.locationArea.location.id - e2.locationArea.location.id
    }

    if (e1.locationArea.id !== e2.locationArea.id) {
        return e1.locationArea.id - e2.locationArea.id
    }

    if (e1.minLevel !== e2.minLevel) {
        return e1.minLevel - e2.minLevel
    }

    if (e1.maxLevel !== e2.maxLevel) {
        return e1.maxLevel - e2.maxLevel
    }

    if (e1.encounterSlot.rarity !== e2.encounterSlot.rarity) {
        // descending order of rarity
        return e2.encounterSlot.rarity - e1.encounterSlot.rarity
    }

    return 0
}

/**
 * Sorts the given move details.
 */
export const sortMoveDetails = (md1: PokemonMove, md2: PokemonMove) => {
    if (md1.learnMethod.id !== md2.learnMethod.id) {
        return md1.learnMethod.id - md2.learnMethod.id
    }

    if (md1.learnMethod.id === 1) {
        // sort level up move details by level
        return md1.level - md2.level
    }

    return getName(md1.move).localeCompare(getName(md1.move))
}

export const sortById = (a: { id: number }, b: { id: number }) => a.id - b.id

/**
 * Returns whether the two encounters can be merged, i.e. whether their level
 * ranges merged together and their rarities summed together form a well-defined
 * set of information.
 */
export const canBeMerged = (e: Encounter, f: Encounter) => {
    let firstConditionsAreAllDefault = e.conditionValues.length <= 0 || e.conditionValues.every(cv => cv.value.isDefault)
    let secondConditionsAreAllDefault = f.conditionValues.length <= 0 || f.conditionValues.every(cv => cv.value.isDefault)

    if (firstConditionsAreAllDefault && secondConditionsAreAllDefault) {
        // both encounters require no conditions
        return true
    }

    // default conditions do not matter now, only care about non-default ones
    let firstConditions = e.conditionValues.map(cv => cv.value).filter(v => !v.isDefault)
    let secondConditions = f.conditionValues.map(cv => cv.value).filter(v => !v.isDefault)

    if (firstConditions.length !== secondConditions.length) {
        return false
    }

    let firstConditionsIds = firstConditions.map(v => v.id)
    let secondConditionsIds = secondConditions.map(v => v.id)

    // both encounters require the same set of conditions
    return firstConditionsIds.every(i => secondConditionsIds.includes(i))
}

/**
 * Groups the given encounters into an array of arrays of encounters.
 * Encounters are matched (put in the same array as each other) based on
 * whether they have matching condition values, and so can be considered
 * together as sets of coherent information.
 */
export const createMergedEncounters = (encounters: Encounter[]) => {
    let mergeMap = [
        [encounters[0]]
    ]

    for (let i = 1; i < encounters.length; i++) {
        let e = encounters[i]

        let matchIndex = mergeMap.findIndex(arr => canBeMerged(e, arr[0]))
        if (matchIndex < 0) {
            mergeMap.push([e])
        }
        else {
            mergeMap[matchIndex].push(e)
        }
    }

    return mergeMap
}

/**
 * Returns the probability of the given critical hit rate in the given generation.
 */
export const calculateCriticalHitChance = (rate: number, generation: Generation) => {
    let effectiveRate = Math.min(4, Math.max(0, rate))

    switch (effectiveRate) {
        case 0:
            return generation.id >= 7 ? 1/24 : 1/16

        case 1:
            return 1/8

        case 2:
            return generation.id >= 6 ? 1/2 : 1/4

        case 3:
            return generation.id >= 6 ? 1 : 1/3

        case 4:
            return generation.id >= 6 ? 1 : 1/2

        default:
            throw new Error(`Unknown critical hit rate ${effectiveRate} provided!`)
    }
}
