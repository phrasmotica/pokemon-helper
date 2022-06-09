import { NamedModel } from "./NamedModel"
import { Type } from "./Type"

export type Move = NamedModel & {
    type: Type
}
