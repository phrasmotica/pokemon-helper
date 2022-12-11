import { useState } from "react"
import { Accordion, Icon, Menu } from "semantic-ui-react"

import "./HistoryMenu.css"

interface HistoryItem {
    id: number
    name: string
}

interface HistoryMenuProps {
    history: HistoryItem[]
    renderItem: (item: HistoryItem) => JSX.Element
    setItem: (name: string) => void
}

export const HistoryMenu = (props: HistoryMenuProps) => {
    const [active, setActive] = useState(false)

    let hasHistory = props.history.length > 0
    if (!hasHistory) {
        return null
    }

    return (
        <Accordion className="history-menu-container">
            <Accordion.Title active={active && hasHistory} onClick={() => setActive(!active)}>
                <Icon name="dropdown" />
                History ({props.history.length})
            </Accordion.Title>

            <Accordion.Content active={active && hasHistory}>
                <div className="history-menu">
                    <Menu vertical fluid>
                        {props.history.map(s => (
                            <Menu.Item key={s.id} onClick={() => props.setItem(s.name)}>
                                {props.renderItem(s)}
                            </Menu.Item>
                        ))}
                    </Menu>
                </div>
            </Accordion.Content>
        </Accordion>
    )
}
