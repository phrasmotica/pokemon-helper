import { VersionGroup } from "./models/VersionGroup"
import { Version } from "./models/Version"

/**
 * Groups elements of the given array by the given key function, and returns the
 * grouping as a Map<string, T[]>.
 * Taken from https://stackoverflow.com/a/47752730
 */
export const groupBy = <T>(arr: T[], func: (x: T) => string) => arr.reduce(
    (entryMap, e) => entryMap.set(func(e), [...entryMap.get(func(e)) || [], e]),
    new Map<string, T[]>()
)

const getVersionName = (version: Version) => version.names[0]!.name

export const getVersionGroupName = (versionGroup: VersionGroup) => versionGroup.versions.map(getVersionName).join("/")
