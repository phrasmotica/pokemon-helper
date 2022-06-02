import { Name } from "./models/Name"
import { VersionGroup } from "./models/VersionGroup"
import { PokemonForm, PokemonMove, Species, Variety } from "./SpeciesQuery"

/**
 * Returns an array of consecutive integers of a given length.
 * Taken from https://stackoverflow.com/a/29559488
 */
export const range = (start: number, length: number) => Array(length).fill(0).map((_, i) => i + start)

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
 * Sorts the given moves.
 */
export const sortMoves = (m1: PokemonMove[], m2: PokemonMove[]) => {
    let m1FirstLearnMethod = m1[0].learnMethod.id
    let m2FirstLearnMethod = m2[0].learnMethod.id

    if (m1FirstLearnMethod === 1 && m2FirstLearnMethod === 1) {
        return m1[0].level - m2[0].level
    }

    if (m1FirstLearnMethod === m2FirstLearnMethod) {
        return getName(m1[0].move).localeCompare(getName(m2[0].move))
    }

    return m1[0].learnMethod.id - m2[0].learnMethod.id
}
