import { Name } from "./models/Name"
import { VersionGroup } from "./models/VersionGroup"
import { PokemonForm, PokemonMove, Species, Variety } from "./SpeciesQuery"

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

export const moveToFront = <T>(arr: T[], elem: T) => {
    let index = arr.indexOf(elem)
    if (index > 0) {
        arr.splice(index, 1)
        arr.unshift(elem)
    }

    return arr
}

export const getGenus = (x: Species) => x.names[0]!.genus

export const getName = (x: { names: Name[] }) => x.names[0]!.name

export const getVarietyName = (v: Variety) => {
    if (v.isDefault) {
        return ""
    }

    let formName = ""

    let form = v.forms[0]!
    if (form.formName.length > 0) {
        formName = getName(form) || form.name
    }

    return formName
}

export const getVersionGroupName = (versionGroup: VersionGroup) => versionGroup.versions.map(getName).join("/")

/**
 * Returns the effective type of a Pokemon in the given version group.
 * @param variety
 * @param form
 * @param versionGroup
 * @returns
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
 * Sorts the given move details.
 */
const sortMoveDetails = (md1: PokemonMove, md2: PokemonMove) => {
    if (md1.learnMethod.id !== md2.learnMethod.id) {
        return md1.learnMethod.id - md2.learnMethod.id
    }

    if (md1.learnMethod.id === 1) {
        // sort level up move details by level
        return md1.level - md2.level
    }

    return getName(md1.move).localeCompare(getName(md1.move))
}
