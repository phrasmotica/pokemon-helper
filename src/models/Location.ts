import { LocationArea } from "./Encounter"
import { Name } from "./Name"
import { NamedModel } from "./NamedModel"

export interface Location {
    id: number
    name: string
    names: Name[]
    region: Region
    areas: LocationArea[]
}

export interface Region extends NamedModel {}
