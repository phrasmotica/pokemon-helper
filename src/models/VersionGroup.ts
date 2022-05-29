import { Generation } from "./Generation"
import { Version } from "./Version"

export interface VersionGroup {
    id: number
    name: string
    generation: Generation
    versions: Version[]
}
