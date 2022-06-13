import { Name } from "../models/Name"
import { VersionGroup } from "../models/VersionGroup"

import { Encounter, LocationArea } from "../models/Encounter"
import { FlavourText, VersionFlavourText } from "../models/FlavourText"
import { PokemonForm } from "../models/PokemonForm"
import { Species } from "../models/Species"
import { PokemonMove, Variety } from "../models/Variety"

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
