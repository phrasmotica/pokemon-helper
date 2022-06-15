import { useEffect, useState } from "react"
import { Accordion, Button, Icon, Segment } from "semantic-ui-react"

import { ChainLink, EvolutionChain, EvolutionDetail } from "./models/EvolutionChain"

import { PokemonSprite } from "./PokemonSprite"

import "./EvolutionChainDiagram.css"

interface EvolutionChainDiagramProps {
    evolutionChainId: number | undefined
    showShiny: boolean
    species: string
    setSpecies: (name: string) => void
}

export const EvolutionChainDiagram = (props: EvolutionChainDiagramProps) => {
    const [active, setActive] = useState(true)
    const [evolutionChain, setEvolutionChain] = useState<EvolutionChain>()

    useEffect(() => {
        if (props.evolutionChainId) {
            fetchEvolutionChain(props.evolutionChainId)
        }
        else {
            setEvolutionChain(undefined)
        }

        return () => setEvolutionChain(undefined)
    }, [props.evolutionChainId])

    const fetchEvolutionChain = (id: number) => {
        fetch(`${process.env.REACT_APP_API_URL}/evolution-chain/${id}`)
            .then(res => res.json())
            .then(setEvolutionChain)
    }

    const renderEvolutionChain = (chain: EvolutionChain) => (
        <div className="evolution-chain-diagram">
            {renderChainLink(chain.chain)}
        </div>
    )

    const renderChainLink = (link: ChainLink) => {
        let name = link.species.name

        let chainLinkClass = "chain-link"

        let isRoot = link.evolution_details.length <= 0
        if (!isRoot) {
            chainLinkClass += " child"
        }

        let speciesNameClass = "species-name"

        let isCurrent = name === props.species
        if (isCurrent) {
            speciesNameClass += " current"
        }

        return (
            <div key={name} className={chainLinkClass}>
                {!isRoot && renderEvolutionDetails(link.evolution_details)}

                <div>
                    <PokemonSprite
                        key={name}
                        pokemon={name}
                        showShiny={props.showShiny} />

                    <div className="link-name">
                        <span className={speciesNameClass}>
                            {name}
                        </span>

                        <Button
                            circular
                            color="green"
                            size="mini"
                            icon="search"
                            disabled={isCurrent}
                            onClick={() => props.setSpecies(name)}>
                        </Button>
                    </div>
                </div>

                <div className="child-links">
                    {link.evolves_to.map(renderChainLink)}
                </div>
            </div>
        )
    }

    const renderEvolutionDetails = (details: EvolutionDetail[]) => (
        <div className="evolution-details">
            <Icon name="arrow right" />

            {details.map(renderEvolutionDetail)}
        </div>
    )

    const renderEvolutionDetail = (detail: EvolutionDetail) => (
        // TODO: show other details here
        <div className="evolution-detail">
            {detail.trigger.name === "level-up" && !detail.min_level && <div>Level up</div>}
            {detail.min_level && <div>Level {detail.min_level}</div>}
            {detail.trigger.name === "trade" && <div>Trade</div>}
            {detail.min_affection && <div>Min. {detail.min_affection} affection</div>}
            {detail.min_beauty && <div>Min. {detail.min_beauty} beauty</div>}
            {detail.min_happiness && <div>Min. {detail.min_happiness} happiness</div>}
            {detail.item && <div>use {detail.item.name}</div>}
            {detail.held_item && <div>holding {detail.held_item.name}</div>}
            {detail.gender && <div>must be {detail.gender}</div>}
            {detail.location && <div>at {detail.location.name}</div>}
            {detail.time_of_day && <div>at {detail.time_of_day}</div>}
        </div>
    )

    return (
        <Accordion className="evolution-chain-diagram-container">
            <Accordion.Title active={active} onClick={() => setActive(!active)}>
                <Icon name="dropdown" />
                Evolution
            </Accordion.Title>

            <Accordion.Content active={active}>
                <Segment>
                    {evolutionChain && renderEvolutionChain(evolutionChain)}
                </Segment>
            </Accordion.Content>
        </Accordion>
    )
}
