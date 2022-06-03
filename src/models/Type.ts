import { Generation } from "./Generation"
import { Name } from "./Name"

export interface Type {
    id: number
    name: string
    names: Name[]
    generation: Generation
}
