import { Version } from "./Version"

export interface VersionGroup {
    id: number
    name: string
    versions: Version[]
}
