import { useState } from "react"
import { Button, Dropdown, Input, Menu } from "semantic-ui-react"

import { BasicInfo } from "./BasicInfo"
import { getVersionGroupName } from "./Helpers"
import { MovesTable } from "./MovesList"
import { useSpeciesQuery } from "./SpeciesQuery"
import { StatsTable } from "./StatsTable"
import { useVersionGroupsQuery } from "./VersionGroupQuery"

import "./App.css"

const history = ["piplup"]

const App = () => {
    const [species, setSpecies] = useState("")
    const [versionGroup, setVersionGroup] = useState<number>()

    const { loadingSpecies, error, speciesData, refetchSpecies } =
        useSpeciesQuery("piplup")

    const { loadingVersionGroups, versionGroupsError, versionGroupsData, refetchVersionGroups } =
        useVersionGroupsQuery()

    const findSpecies = (speciesName: string) => {
        if (!history.includes(speciesName)) {
            history.push(speciesName)
        }

        refetchSpecies(speciesName)
    }

    let versionGroupOptions = loadingVersionGroups ? [] : versionGroupsData!.versionGroupInfo.map(vg => ({
        key: vg.id,
        text: getVersionGroupName(vg),
        value: vg.id,
    }))

    let speciesInfo = loadingSpecies ? undefined : speciesData!.speciesInfo[0]!
    let variety = loadingSpecies ? undefined : speciesInfo!.varieties.find(v => v.isDefault)!

    let moves = loadingSpecies ? [] : variety!.moves
    let stats = loadingSpecies ? [] : variety!.stats

    return (
        <div className="App">
            <div className="App-header">
                <div className="control-container">
                    <div className="input-container">
                        <h2>Species search</h2>

                        <div className="species-input-container">
                            <Input
                                className="species-input"
                                placeholder="Species..."
                                loading={loadingSpecies}
                                value={species}
                                onChange={(e, data) => setSpecies(data.value)} />

                            <div className="find-button-container">
                                <Button onClick={() => findSpecies(species)}>
                                    Find
                                </Button>
                            </div>
                        </div>

                        <Dropdown
                            fluid
                            selection
                            loading={loadingVersionGroups}
                            placeholder="Version group..."
                            options={versionGroupOptions}
                            value={versionGroup}
                            onChange={(e, data) => setVersionGroup(Number(data.value))} />
                    </div>

                    <div className="history-container">
                        <h4>History</h4>

                        <Menu vertical fluid>
                            {history.map(s => (
                                <Menu.Item key={s} onClick={() => findSpecies(s)}>
                                    {s}
                                </Menu.Item>
                            ))}
                        </Menu>
                    </div>
                </div>

                {!loadingSpecies && <div className="details-container">
                    <BasicInfo speciesInfo={speciesInfo!} />
                    <StatsTable stats={stats} />
                    <MovesTable moves={moves} versionGroup={versionGroup} />
                </div>}
            </div>
        </div>
    )
}

export default App
