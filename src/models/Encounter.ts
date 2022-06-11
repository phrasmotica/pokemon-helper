import { NamedModel } from "./NamedModel"
import { Version } from "./Version"

export interface Encounter {
    id: number
    minLevel: number
    maxLevel: number
    version: Version
    conditionValues: EncounterConditionValueMap[]
    locationArea: LocationArea
    encounterSlot: EncounterSlot
}

interface EncounterConditionValueMap {
    id: number
    value: EncounterConditionValue
}

interface EncounterConditionValue extends NamedModel {
    isDefault: boolean
}

export interface LocationArea extends NamedModel {
    location: Location
}

interface Location extends NamedModel {

}

interface EncounterSlot {
    id: number
    rarity: number
    slot: number
    method: EncounterMethod
}

interface EncounterMethod extends NamedModel {

}
