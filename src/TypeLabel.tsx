import { Label, SemanticSIZES } from "semantic-ui-react"

import { Type } from "./SpeciesQuery"

import "./TypeLabel.css"

interface TypeLabelProps {
    type: Type
    size?: SemanticSIZES
}

export const TypeLabel = (props: TypeLabelProps) => (
    <Label
        className={"type-label " + props.type.name}
        size={props.size}>
        {props.type.names[0]!.name}
    </Label>
)
