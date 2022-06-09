import { Generation } from "./Generation"
import { NamedModel } from "./NamedModel"

export type Type = NamedModel & {
    generation: Generation
}
