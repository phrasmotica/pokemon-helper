import { Label, SemanticSIZES } from "semantic-ui-react"

import { getName } from "./Helpers"
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
        {getName(props.type)}
    </Label>
)
