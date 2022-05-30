import { useState } from "react"
import { Accordion, Icon, Menu } from "semantic-ui-react"

import { Name } from "./models/Name"

import { getName } from "./Helpers"

import "./HistoryMenu.css"

interface HistoryItem {
    id: number
    name: string
    order: number
    names: Name[]
}

interface HistoryMenuProps {
    history: HistoryItem[]
    findSpecies: (species: string) => void
}

export const HistoryMenu = (props: HistoryMenuProps) => {
    const [active, setActive] = useState(false)

    return (
        <Accordion className="history-menu-container">
            <Accordion.Title active={active} onClick={() => setActive(!active)}>
                <Icon name="dropdown" />
                History ({props.history.length})
            </Accordion.Title>

            <Accordion.Content active={active}>
                <div className="history-menu">
                    <Menu vertical fluid>
                        {props.history.map(s => (
                            <Menu.Item key={s.id} onClick={() => props.findSpecies(s.name)}>
                                {getName(s)} <span className="species-order">(&#x00023;{s.order})</span>
                            </Menu.Item>
                        ))}
                    </Menu>
                </div>
            </Accordion.Content>
        </Accordion>
    )
}
