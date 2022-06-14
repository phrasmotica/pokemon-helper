import { NamedModel } from "./NamedModel"

export interface EvolutionChain {
    id: number
    species: EvolutionChainSpecies[]
}

interface EvolutionChainSpecies extends NamedModel {
    varieties: EvolutionChainVariety[]
}

interface EvolutionChainVariety {
    id: number
    name: string
}
