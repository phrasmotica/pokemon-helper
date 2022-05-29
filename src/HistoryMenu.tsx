import { Menu } from "semantic-ui-react"
import { getName } from "./Helpers"

import { Name } from "./models/Name"

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

export const HistoryMenu = (props: HistoryMenuProps) => (
    <div className="history-container">
        <h4>History</h4>

        <Menu vertical fluid>
            {props.history.map(s => (
                <Menu.Item key={s.id} onClick={() => props.findSpecies(s.name)}>
                    {getName(s)} <span className="species-order">(&#x00023;{s.order})</span>
                </Menu.Item>
            ))}
        </Menu>
    </div>
)
