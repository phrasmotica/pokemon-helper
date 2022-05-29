import { Name } from "./models/Name"
import { VersionGroup } from "./models/VersionGroup"
import { PokemonForm, Variety } from "./SpeciesQuery"

/**
 * Groups elements of the given array by the given key function, and returns the
 * grouping as a Map<string, T[]>.
 * Taken from https://stackoverflow.com/a/47752730
 */
export const groupBy = <T>(arr: T[], func: (x: T) => string) => arr.reduce(
    (entryMap, e) => entryMap.set(func(e), [...entryMap.get(func(e)) || [], e]),
    new Map<string, T[]>()
)

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
