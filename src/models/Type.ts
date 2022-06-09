import { Generation } from "./Generation"
import { NamedModel } from "./NamedModel"

export interface Type extends NamedModel {
    generation: Generation
}
