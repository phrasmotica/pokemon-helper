import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import reportWebVitals from "./reportWebVitals"

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"

const apiUrl = process.env.REACT_APP_API_URL || "https://beta.pokeapi.co/graphql/v1beta"

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: apiUrl,
})

ReactDOM.render(
    <ApolloProvider client={client}>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </ApolloProvider>,
    document.getElementById("root") as HTMLElement
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
