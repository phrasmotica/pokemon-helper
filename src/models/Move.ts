import { Name } from "./Name"
import { Type } from "./Type"

export interface Move {
    id: number
    name: string
    names: Name[]
    type: Type
}
