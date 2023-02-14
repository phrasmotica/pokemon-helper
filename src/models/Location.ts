import { LocationArea } from "./Encounter"
import { Name } from "./Name"
import { Region } from "./Region"

export interface Location {
    id: number
    name: string
    names: Name[]
    region: Region
    areas: LocationArea[]
}
