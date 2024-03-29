import { useState } from "react"
import { Accordion, Icon, Input } from "semantic-ui-react"

import { PokemonMove } from "./models/Variety"

import { getName, groupBy, sortMoves } from "./util/Helpers"
import { MoveLearnMethodSelector } from "./MoveLearnMethodSelector"
import { MoveTypeSelector } from "./MoveTypeSelector"
import { TypeLabel } from "./TypeLabel"

import "./MovesList.css"

interface MovesListProps {
    moves: PokemonMove[]
    versionGroupId: number | undefined
}

export const MovesList = (props: MovesListProps) => {
    const [active, setActive] = useState(false)
    const [openMoves, setOpenMoves] = useState<number[]>([])

    const [searchTerm, setSearchTerm] = useState("")
    const [selectedMoveTypes, setSelectedMoveTypes] = useState<number[]>([])
    const [selectedMoveLearnMethods, setSelectedMoveLearnMethods] = useState<number[]>([])

    const toggleMoveOpen = (moveId: number) => {
        let newOpenMoves = [...openMoves]

        if (!newOpenMoves.includes(moveId)) {
            newOpenMoves.push(moveId)
        }
        else {
            let index = newOpenMoves.indexOf(moveId)
            newOpenMoves.splice(index, 1)
        }

        setOpenMoves(newOpenMoves)
    }

    const isValidDetail = (md: PokemonMove) => (
        !props.versionGroupId || md.versionGroup.id === props.versionGroupId!
    )

    const matchesSearchTerm = (m: PokemonMove[]) => (
        // TODO: match using fuzzy search package
        getName(m[0]!.move).toLowerCase().includes(searchTerm.toLowerCase())
    )

    const passesTypesFilter = (m: PokemonMove[]) => (
        selectedMoveTypes.length <= 0 || selectedMoveTypes.includes(m[0]!.move.type.id)
    )

    const isValidDetailWithLearnMethod = (md: PokemonMove) => {
        let hasLearnMethod = selectedMoveLearnMethods.length <= 0 || selectedMoveLearnMethods.includes(md.learnMethod.id)
        return isValidDetail(md) && hasLearnMethod
    }

    const passesFilters = (m: PokemonMove[]) => matchesSearchTerm(m) && passesTypesFilter(m) && m.some(isValidDetailWithLearnMethod)

    const getDisplayText = (md: PokemonMove, index: number) => {
        let learnMethodText = getName(md.learnMethod)
        if (md.learnMethod.id === 1) {
            learnMethodText = `Level ${md.level}`
        }

        if (index > 0) {
            learnMethodText = " / " + learnMethodText
        }

        return learnMethodText
    }

    let groupedMoves = groupBy(props.moves, m => m.move.name)
    let uniqueMoves = Array.from(groupedMoves.values())
    let relevantMoves = uniqueMoves.filter(m => m.some(isValidDetail))
    let filteredMoves = relevantMoves.filter(passesFilters)

    // only consider move details in the selected version group
    for (let i = 0; i < filteredMoves.length; i++) {
        filteredMoves[i] = filteredMoves[i].filter(isValidDetail)
    }

    filteredMoves.sort(sortMoves)

    let moveAccordionItems = []

    for (let moveDetails of filteredMoves) {
        let moveId = moveDetails[0]!.move.id

        if (moveDetails.length > 0) {
            let exampleMoveDetail = moveDetails[0]!
            let move = exampleMoveDetail.move

            moveAccordionItems.push(
                <Accordion.Title
                    key={"title" + moveId}
                    className="move-header"
                    active={openMoves.includes(moveId)}
                    onClick={() => toggleMoveOpen(moveId)}>
                    <div className="move-name-container">
                        <span>{getName(exampleMoveDetail.move)}</span>

                        <div className="move-type">
                            <TypeLabel type={move.type} />
                        </div>
                    </div>

                    <span><em>{moveDetails.length} detail(s)</em></span>
                </Accordion.Title>
            )

            moveAccordionItems.push(
                <Accordion.Content
                    key={"content" + moveId}
                    className="move-content"
                    active={openMoves.includes(moveId)}>
                    <div>
                        {moveDetails.map((md, i) => <span key={md.id}>{getDisplayText(md, i)}</span>)}
                    </div>
                </Accordion.Content>
            )
        }
    }

    return (
        <Accordion className="moves-list-container">
            <Accordion.Title active={active} onClick={() => setActive(!active)}>
                <Icon name="dropdown" />
                Moves
            </Accordion.Title>

            <Accordion.Content active={active}>
                <div className="move-filters-container">
                    <Input
                        fluid
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e, data) => setSearchTerm(data.value)} />

                    <MoveTypeSelector
                        moves={relevantMoves}
                        passesOtherFilters={m => matchesSearchTerm(m) && m.some(isValidDetailWithLearnMethod)}
                        selectedMoveTypes={selectedMoveTypes}
                        setSelectedMoveTypes={setSelectedMoveTypes} />

                    <MoveLearnMethodSelector
                        moves={relevantMoves}
                        passesOtherFilters={m => matchesSearchTerm(m) && passesTypesFilter(m)}
                        isValidDetail={isValidDetail}
                        selectedMoveLearnMethods={selectedMoveLearnMethods}
                        setSelectedMoveLearnMethods={setSelectedMoveLearnMethods} />
                </div>

                <Accordion className="moves-list" styled>
                    {moveAccordionItems}
                </Accordion>
            </Accordion.Content>
        </Accordion>
    )
}
