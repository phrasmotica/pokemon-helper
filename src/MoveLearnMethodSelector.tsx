import { Dropdown } from "semantic-ui-react"

import { MoveLearnMethod } from "./models/MoveLearnMethod"
import { PokemonMove } from "./models/Variety"

import { getName, sortById, uniqueBy } from "./Helpers"

interface MoveLearnMethodSelectorProps {
    moves: PokemonMove[][]
    passesOtherFilters: (m: PokemonMove[]) => boolean
    isValidDetail: (md: PokemonMove) => boolean
    selectedMoveLearnMethods: number[]
    setSelectedMoveLearnMethods: (types: number[]) => void
}

export const MoveLearnMethodSelector = (props: MoveLearnMethodSelectorProps) => {
    const isValidDetailWithLearnMethod = (md: PokemonMove, lm: MoveLearnMethod) => (
        props.isValidDetail(md) && md.learnMethod.id === lm.id
    )

    const getCount = (lm: MoveLearnMethod) => {
        let movesPassingOtherFilters = props.moves.filter(props.passesOtherFilters)

        // moves that also have this learn method
        let movesWithValidTypeAndLearnMethod = movesPassingOtherFilters.filter(m => m.some(md => isValidDetailWithLearnMethod(md, lm)))

        return movesWithValidTypeAndLearnMethod.length
    }

    let moveLearnMethods = props.moves.flatMap(m => m).map(md => md.learnMethod)
    let uniqueMoveLearnMethods = uniqueBy(moveLearnMethods, lm => lm.id)
    uniqueMoveLearnMethods.sort(sortById)

    let options = uniqueMoveLearnMethods.map(lm => {
        let count = getCount(lm)

        return {
            key: lm.id,
            text: getName(lm) + ` (${count})`,
            value: lm.id,
            disabled: count <= 0,
        }
    })

    return (
        <Dropdown
            placeholder="Filter by learn method..."
            fluid
            multiple
            search
            selection
            clearable
            options={options}
            value={props.selectedMoveLearnMethods}
            onChange={(e, data) => props.setSelectedMoveLearnMethods(data.value as number[])} />
    )
}
