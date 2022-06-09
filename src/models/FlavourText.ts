import { Version } from "./Version"
import { VersionGroup } from "./VersionGroup"

export interface FlavourText {
    id: number
    text: string
    versionGroup: VersionGroup
}

export interface VersionFlavourText {
    id: number
    text: string
    version: Version & {
        versionGroup: VersionGroup
    }
}
