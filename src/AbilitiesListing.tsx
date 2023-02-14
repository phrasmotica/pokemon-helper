import { useState } from "react"
import { Accordion, Icon, List, Segment } from "semantic-ui-react"

import { PokemonAbility } from "./models/Variety"
import { VersionGroup } from "./models/VersionGroup"

import { getShortEffect, getName } from "./util/Helpers"

import "./AbilitiesListing.css"
import { AbilityMessage } from "./AbilityMessage"

interface AbilitiesListingProps {
    abilities: PokemonAbility[]
    versionGroup: VersionGroup | undefined
}

export const AbilitiesListing = (props: AbilitiesListingProps) => {
    const [active, setActive] = useState(true)

    const renderAbility = (a: PokemonAbility) => (
        <List.Item key={a.id} className="pokemon-ability">
            <div className="ability-name">
                <span>
                    {getName(a.ability)}
                </span>

                {a.isHidden && <span className="ability-hidden">
                    &nbsp;(hidden)
                </span>}
            </div>

            <div className="ability-effect">
                <span>
                    {getShortEffect(a.ability)}
                </span>
            </div>
        </List.Item>
    )

    let relevantAbilities = props.abilities.filter(
        a => !props.versionGroup || a.ability.generation.id <= props.versionGroup.generation.id
    )

    if (props.versionGroup && props.versionGroup.generation.id < 3) {
        return <AbilityMessage versionGroup={props.versionGroup} />
    }

    return (
        <Accordion className="abilities-listing-container">
            <Accordion.Title active={active} onClick={() => setActive(!active)}>
                <Icon name="dropdown" />
                Abilities
            </Accordion.Title>

            <Accordion.Content active={active}>
                <Segment>
                    <div className="abilities-listing">
                        <List divided relaxed>
                            {relevantAbilities.map(renderAbility)}
                        </List>
                    </div>
                </Segment>
            </Accordion.Content>
        </Accordion>
    )
}
