import { useState } from "react"
import { Accordion, Icon, Segment, Tab } from "semantic-ui-react"
import { getName, sortById, uniqueBy } from "./Helpers"

import { MoveDetailsList } from "./MoveDetailsList"
import { PokemonMove } from "./SpeciesQuery"

import "./MovesListing.css"

interface MovesListingProps {
    moves: PokemonMove[]
    versionGroupId: number | undefined
}

export const MovesListing = (props: MovesListingProps) => {
    const [active, setActive] = useState(true)

    const isValidDetail = (md: PokemonMove) => (
        !props.versionGroupId || md.versionGroup.id === props.versionGroupId!
    )

    const getDetailsWithLearnMethod = (details: PokemonMove[], learnMethodId: number) => (
        details.filter(md => md.learnMethod.id === learnMethodId)
    )

    let hasMoves = props.moves.length > 0
    if (!hasMoves) {
        return null
    }

    let validDetails = props.moves.filter(isValidDetail)

    let learnMethods = uniqueBy(validDetails, md => md.learnMethod.id).map(md => md.learnMethod)
    learnMethods.sort(sortById)

    const panes = learnMethods.map(lm => ({
        menuItem: getName(lm),
        render: () => <Tab.Pane className="move-details-list-container">
            <MoveDetailsList key={lm.name} moveDetails={getDetailsWithLearnMethod(validDetails, lm.id)} />
        </Tab.Pane>,
    }))

    let content = <Tab menu={{ pointing: true, }} panes={panes} />

    if (validDetails.length <= 0) {
        content = <Segment><span>No moves to show!</span></Segment>
    }

    return (
        <Accordion className="moves-listing-container">
            <Accordion.Title active={active && hasMoves} onClick={() => setActive(!active)}>
                <Icon name="dropdown" />
                Moves
            </Accordion.Title>

            <Accordion.Content active={active && hasMoves}>
                {content}
            </Accordion.Content>
        </Accordion>
    )
}
