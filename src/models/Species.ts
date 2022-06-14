import { EvolutionChain } from "./EvolutionChain"
import { VersionFlavourText } from "./FlavourText"
import { Generation } from "./Generation"
import { Name } from "./Name"
import { Variety } from "./Variety"

export interface Species {
    id: number
    name: string
    order: number
    genderRate: number
    captureRate: number
    names: SpeciesName[]
    evolutionChain: EvolutionChain
    flavourTexts: VersionFlavourText[]
    generation: Generation
    varieties: Variety[]
}

export interface SpeciesName extends Name {
    genus: string
}
