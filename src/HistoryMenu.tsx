import { Menu } from "semantic-ui-react"

interface HistoryMenuProps {
    history: string[]
    findSpecies: (species: string) => void
}

export const HistoryMenu = (props: HistoryMenuProps) => (
    <div className="history-container">
        <h4>History</h4>

        <Menu vertical fluid>
            {props.history.map(s => (
                <Menu.Item key={s} onClick={() => props.findSpecies(s)}>
                    {s}
                </Menu.Item>
            ))}
        </Menu>
    </div>
)
