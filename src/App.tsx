import { HashRouter, Link, Route, Routes } from "react-router-dom"
import { Menu } from "semantic-ui-react"

import { PokedexPage } from "./pages/PokedexPage"
import { RouteDexPage } from "./pages/RouteDexPage"

import "./App.css"

const App = () => {
    const renderMenu = () => (
        <Menu fluid>
            <Menu.Item header>
                Pok&eacute;mon Helper
            </Menu.Item>

            <Menu.Item>
                <Link to="/">
                    Pokedex
                </Link>
            </Menu.Item>

            <Menu.Item>
                <Link to="/routedex">
                    RouteDex
                </Link>
            </Menu.Item>
        </Menu>
    )

    // TODO: change background colour per page. Might require restructuring the divs...

    return (
        <div className="App">
            <div className="App-header">
                <HashRouter>
                    {renderMenu()}

                    <Routes>
                        <Route path="/" element={<PokedexPage />} />
                        <Route path="/routedex" element={<RouteDexPage />} />
                    </Routes>
                </HashRouter>
            </div>

            <footer>
                <a href="https://github.com/phrasmotica/pokemon-helper/issues" target="_blank" rel="noopener noreferrer">
                    Found a bug? Report it here!
                </a>

                <a href="https://www.flaticon.com/free-icons/pokemon" title="pokemon icons">
                    Pokemon icons created by Nikita Golubev - Flaticon
                </a>
            </footer>
        </div>
    )
}

export default App
