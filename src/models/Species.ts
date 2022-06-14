import { VersionFlavourText } from "./FlavourText"
import { Generation } from "./Generation"
import { Name } from "./Name"
import { Variety } from "./Variety"

export interface Species {
    id: number
    name: string
    order: number
    captureRate: number
    names: SpeciesName[]
    flavourTexts: VersionFlavourText[]
    generation: Generation
    varieties: Variety[]
}

export interface SpeciesName extends Name {
    genus: string
}
