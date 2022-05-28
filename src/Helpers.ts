import { Name } from "./models/Name"
import { VersionGroup } from "./models/VersionGroup"
import { Variety } from "./SpeciesQuery"

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
