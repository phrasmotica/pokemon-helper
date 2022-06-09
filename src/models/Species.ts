import { Generation } from "./Generation"
import { Name } from "./Name"
import { Variety } from "./Variety"

export interface Species {
    id: number
    name: string
    order: number
    names: SpeciesName[]
    generation: Generation
    varieties: Variety[]
}

export type SpeciesName = Name & {
    genus: string
}
