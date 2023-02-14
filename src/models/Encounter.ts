import { Location } from "./Location"
import { NamedModel } from "./NamedModel"
import { Version } from "./Version"

export interface Encounter {
    id: number
    minLevel: number
    maxLevel: number
    pokemon: Pokemon
    version: Version
    conditionValues: EncounterConditionValueMap[]
    locationArea: LocationArea
    encounterSlot: EncounterSlot
}

export interface Pokemon {
    id: number
    name: string
    species: {
        id: number
        name: string
    }
}

export interface EncounterConditionValueMap {
    id: number
    value: EncounterConditionValue
}

interface EncounterConditionValue extends NamedModel {
    isDefault: boolean
}

export interface LocationArea extends NamedModel {
    location: Location
    encounters: Encounter[]
    encountersAgg: AggregateInfo
}

interface AggregateInfo {
    aggregate: Aggregate
}

interface Aggregate {
    count: number
}

interface EncounterSlot {
    id: number
    rarity: number
    slot: number
    method: EncounterMethod
}

interface EncounterMethod extends NamedModel {

}
