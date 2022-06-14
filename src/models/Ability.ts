import { Generation } from "./Generation"
import { NamedModel } from "./NamedModel"

export interface Ability extends NamedModel {
    descriptions: AbilityEffectText[]
    generation: Generation
}

interface AbilityEffectText {
    id: number
    shortEffect: string
    effect: string
}
