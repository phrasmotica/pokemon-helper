import { Generation } from "./Generation"
import { Move } from "./Move"
import { MoveLearnMethod } from "./MoveLearnMethod"
import { NamedModel } from "./NamedModel"
import { PokemonForm } from "./PokemonForm"
import { Type } from "./Type"
import { VersionGroup } from "./VersionGroup"

export interface Variety {
    id: number
    name: string
    isDefault: boolean
    forms: PokemonForm[]
    moves: PokemonMove[]
    pastTypes: PokemonTypePast[]
    types: PokemonType[]
    stats: PokemonStat[]
}

export interface PokemonMove {
    id: number
    level: number
    learnMethod: MoveLearnMethod
    move: Move
    versionGroup: VersionGroup
}

export interface PokemonTypePast {
    id: number
    generation: Generation
    type: Type
}

type Stat = NamedModel

export interface PokemonStat {
    id: number
    stat: Stat
    baseValue: number
}

export interface PokemonType {
    id: number
    type: Type
}
