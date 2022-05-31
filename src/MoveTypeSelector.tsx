import { Dropdown } from "semantic-ui-react"

import { getName, uniqueBy } from "./Helpers"
import { PokemonMove } from "./SpeciesQuery"

interface MoveTypeSelectorProps {
    moves: PokemonMove[][]
    selectedMoveTypes: number[]
    setSelectedMoveTypes: (types: number[]) => void
}

export const MoveTypeSelector = (props: MoveTypeSelectorProps) => {
    let moveTypes = props.moves.map(m => m[0]!.move.type)
    let uniqueMoveTypes = uniqueBy(moveTypes, t => t.id)
    uniqueMoveTypes.sort((a, b) => a.id - b.id)

    let typeFilterOptions = uniqueMoveTypes.map(t => ({
        key: t.id,
        text: getName(t) + ` (${props.moves.filter(m => m[0]!.move.type.id === t.id).length})`,
        value: t.id,
    }))

    return (
        <Dropdown
            placeholder="Filter by type..."
            fluid
            multiple
            search
            selection
            clearable
            options={typeFilterOptions}
            value={props.selectedMoveTypes}
            onChange={(e, data) => props.setSelectedMoveTypes(data.value as number[])} />
    )
}
