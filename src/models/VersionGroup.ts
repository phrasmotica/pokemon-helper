import { Encounter } from "./Encounter"
import { Generation } from "./Generation"
import { Version } from "./Version"

export interface VersionGroup {
    id: number
    name: string
    generation: Generation
    versions: Version[]
}

export const hasEncounters = (versionGroup: VersionGroup, encounters: Encounter[]) => {
    let versions = versionGroup.versions.map(vg => vg.id)
    let encounterVersions = encounters.map(e => e.version.id)
    return versions.filter(v => encounterVersions.includes(v)).length > 0
}
