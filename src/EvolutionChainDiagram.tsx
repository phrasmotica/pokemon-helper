import { useState } from "react"
import { Accordion, Button, Icon, Segment } from "semantic-ui-react"

import { EvolutionChain, EvolutionChainSpecies } from "./models/EvolutionChain"
import { VersionGroup } from "./models/VersionGroup"

import { getName, sortById } from "./util/Helpers"

import { PokemonSprite } from "./PokemonSprite"

import "./EvolutionChainDiagram.css"

interface EvolutionChainDiagramProps {
    evolutionChain: EvolutionChain
    versionGroup: VersionGroup | undefined
    showShiny: boolean
    species: string
    setSpecies: (name: string) => void
}

export const EvolutionChainDiagram = (props: EvolutionChainDiagramProps) => {
    const [active, setActive] = useState(true)

    const renderEvolutionChain = (chain: EvolutionChain) => {
        let sortedSpecies = chain.species.slice().sort(sortById)

        return (
            <div className="evolution-chain-diagram">
                {sortedSpecies.map(renderChainLink)}
            </div>
        )
    }

    const renderChainLink = (s: EvolutionChainSpecies) => {
        let speciesNameClass = "species-name"

        let isCurrent = s.name === props.species
        if (isCurrent) {
            speciesNameClass += " current"
        }

        return (
            <div key={s.id} className="chain-link">
                <PokemonSprite
                    key={s.name}
                    pokemonId={s.varieties[0]?.id}
                    showShiny={props.showShiny} />

                <div className="link-name">
                    <span className={speciesNameClass}>
                        {getName(s)}
                    </span>

                    <Button
                        circular
                        color="green"
                        size="mini"
                        icon="search"
                        disabled={isCurrent}
                        onClick={() => props.setSpecies(s.name)}>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <Accordion className="evolution-chain-diagram-container">
            <Accordion.Title active={active} onClick={() => setActive(!active)}>
                <Icon name="dropdown" />
                Evolution
            </Accordion.Title>

            <Accordion.Content active={active}>
                <Segment>
                    {renderEvolutionChain(props.evolutionChain)}
                </Segment>
            </Accordion.Content>
        </Accordion>
    )
}
