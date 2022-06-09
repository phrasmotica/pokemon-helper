import { Dropdown } from "semantic-ui-react"

import { Type } from "./models/Type"
import { PokemonMove } from "./models/Variety"

import { getName, sortById, uniqueBy } from "./Helpers"

interface MoveTypeSelectorProps {
    moves: PokemonMove[][]
    passesOtherFilters: (m: PokemonMove[]) => boolean
    selectedMoveTypes: number[]
    setSelectedMoveTypes: (types: number[]) => void
}

export const MoveTypeSelector = (props: MoveTypeSelectorProps) => {
    const getCount = (t: Type) => {
        // moves passed in props already pass the version group filter

        // moves that also pass the learn method filter
        let movesWithValidDetail = props.moves.filter(props.passesOtherFilters)

        // moves that also pass the learn method filter and that have this type
        let movesWithValidDetailAndType = movesWithValidDetail.filter(m => m[0]!.move.type.id === t.id)

        return movesWithValidDetailAndType.length
    }

    let moveTypes = props.moves.map(m => m[0]!.move.type)
    let uniqueMoveTypes = uniqueBy(moveTypes, t => t.id)
    uniqueMoveTypes.sort(sortById)

    let options = uniqueMoveTypes.map(t => {
        let count = getCount(t)

        return {
            key: t.id,
            text: getName(t) + ` (${count})`,
            value: t.id,
            disabled: count <= 0,
        }
    })

    return (
        <Dropdown
            placeholder="Filter by type..."
            fluid
            multiple
            search
            selection
            clearable
            options={options}
            value={props.selectedMoveTypes}
            onChange={(e, data) => props.setSelectedMoveTypes(data.value as number[])} />
    )
}
