import { NamedModel } from "./NamedModel"
import { Type } from "./Type"

export type PokemonForm = NamedModel & {
    formName: string
    isDefault: boolean
    types: PokemonFormType[]
}

export interface PokemonFormType {
    id: number
    type: Type
}
