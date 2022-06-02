import { Message } from "semantic-ui-react"

import "./WelcomeMessage.css"

export const WelcomeMessage = () => (
    <div className="welcome-message-container">
        <Message info>
            Select a Pokémon species to view its stats, type effectiveness and moves!
        </Message>
    </div>
)
