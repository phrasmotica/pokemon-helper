import { useState } from "react"
import { Accordion, Icon } from "semantic-ui-react"

import { getName, groupBy } from "./Helpers"
import { PokemonMove } from "./SpeciesQuery"
import { TypeLabel } from "./TypeLabel"

import "./MovesList.css"

interface MovesTableProps {
    moves: PokemonMove[]
    versionGroup: number | undefined
}

export const MovesList = (props: MovesTableProps) => {
    const [active, setActive] = useState(false)
    const [openMoves, setOpenMoves] = useState<number[]>([])

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

    const sortMoves = (m1: PokemonMove[], m2: PokemonMove[]) => {
        let m1FirstLearnMethod = m1[0].learnMethod.id
        let m2FirstLearnMethod = m2[0].learnMethod.id

        if (m1FirstLearnMethod === 1 && m2FirstLearnMethod === 1) {
            return m1[0].level - m2[0].level
        }

        if (m1FirstLearnMethod === m2FirstLearnMethod) {
            return getName(m1[0].move).localeCompare(getName(m2[0].move))
        }

        return m1[0].learnMethod.id - m2[0].learnMethod.id
    }

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

    let allMoves = props.moves

    let groupedMoves = groupBy(allMoves, m => m.move.name)

    let uniqueMoves = Array.from(groupedMoves.values())
    uniqueMoves.sort(sortMoves)

    let moveAccordionItems = []

    for (let moveDetails of uniqueMoves) {
        let moveId = moveDetails[0]!.move.id

        let filteredMoveDetails = moveDetails
        if (props.versionGroup !== undefined) {
            filteredMoveDetails = filteredMoveDetails.filter(md => md.versionGroup.id === props.versionGroup)
        }


        if (filteredMoveDetails.length > 0) {
            let exampleMoveDetail = filteredMoveDetails[0]!
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

                    <span><em>{filteredMoveDetails.length} detail(s)</em></span>
                </Accordion.Title>
            )

            moveAccordionItems.push(
                <Accordion.Content
                    key={"content" + moveId}
                    className="move-content"
                    active={openMoves.includes(moveId)}>
                    <div>
                        {filteredMoveDetails.map((md, i) => <span key={md.id}>{getDisplayText(md, i)}</span>)}
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
                <Accordion className="moves-list" styled>
                    {moveAccordionItems}
                </Accordion>
            </Accordion.Content>
        </Accordion>
    )
}
