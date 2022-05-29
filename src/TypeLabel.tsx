import { Label, SemanticSIZES } from "semantic-ui-react"

import { Type } from "./models/Type"

import { getName } from "./Helpers"

import "./TypeLabel.css"

interface TypeLabelProps {
    type: Type
    size?: SemanticSIZES
}

export const TypeLabel = (props: TypeLabelProps) => (
    <Label
        className={"type-label " + props.type.name}
        size={props.size}>
        {getName(props.type)}
    </Label>
)
