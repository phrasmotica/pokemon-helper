import { NamedModel } from "./NamedModel"
import { Type } from "./Type"

export interface Move extends NamedModel {
    type: Type
}

export interface MoveLearnMethod extends NamedModel {

}

export interface MoveTarget extends NamedModel {

}
