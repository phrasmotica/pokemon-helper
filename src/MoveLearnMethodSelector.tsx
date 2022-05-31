import { Dropdown } from "semantic-ui-react"

import { getName, uniqueBy } from "./Helpers"
import { LearnMethod, PokemonMove } from "./SpeciesQuery"

interface MoveLearnMethodSelectorProps {
    moves: PokemonMove[][]
    isValidDetail: (md: PokemonMove) => boolean
    selectedMoveLearnMethods: number[]
    setSelectedMoveLearnMethods: (types: number[]) => void
}

export const MoveLearnMethodSelector = (props: MoveLearnMethodSelectorProps) => {
    const isValidDetailWithLearnMethod = (md: PokemonMove, lm: LearnMethod) => (
        props.isValidDetail(md) && md.learnMethod.id === lm.id
    )

    const getCount = (lm: LearnMethod) => {
        // moves passed in props already pass the version group filter and types filter

        // moves that also have this learn method
        let movesWithValidTypeAndLearnMethod = props.moves.filter(m => m.some(md => isValidDetailWithLearnMethod(md, lm)))

        return movesWithValidTypeAndLearnMethod.length
    }

    let moveLearnMethods = props.moves.flatMap(m => m).map(md => md.learnMethod)
    let uniqueMoveLearnMethods = uniqueBy(moveLearnMethods, lm => lm.id)
    uniqueMoveLearnMethods.sort((a, b) => a.id - b.id)

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
