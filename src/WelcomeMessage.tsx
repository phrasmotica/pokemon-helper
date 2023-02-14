import { Message } from "semantic-ui-react"

import "./WelcomeMessage.css"

export const WelcomeMessage = () => (
    <div className="welcome-message-container">
        <Message info>
            Select a Pokémon species to view its stats, type effectiveness and moves!
        </Message>
    </div>
)

export const RouteDexWelcomeMessage = () => (
    <div className="welcome-message-container">
        <Message info>
            Select a location to view the wild Pok&eacute;mon available there!
        </Message>
    </div>
)
