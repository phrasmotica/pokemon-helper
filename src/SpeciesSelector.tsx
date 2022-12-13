import { Button, ButtonGroup, Dropdown } from "semantic-ui-react"

import { useSpeciesOptionsQuery } from "./queries/SpeciesOptionsQuery"

import { getName } from "./util/Helpers"

import "./SpeciesSelector.css"

interface SpeciesSelectorProps {
    species: string
    loadingSpecies: boolean
    setSpecies: (species: string) => void
}

export const SpeciesSelector = (props: SpeciesSelectorProps) => {
    const { loadingSpeciesOptions, speciesOptionsData } = useSpeciesOptionsQuery()

    let options = (speciesOptionsData?.speciesOptions ?? []).map(s => ({
        key: s.name,
        text: getName(s),
        value: s.name,
    }))

    const previousSpecies = () => {
        let currentIndex = options.findIndex(e => e.value === props.species)
        let newIndex = (currentIndex - 1) % options.length
        let newLocation = options[newIndex].value
        props.setSpecies(newLocation)
    }

    const nextSpecies = () => {
        let currentIndex = options.findIndex(e => e.value === props.species)
        let newIndex = (currentIndex + 1) % options.length
        let newLocation = options[newIndex].value
        props.setSpecies(newLocation)
    }

    return (
        <div className="species-selector-container">
            <div className="species-selector-dropdown-container">
                <Dropdown
                    fluid
                    selection
                    search
                    className="species-input"
                    loading={props.loadingSpecies || loadingSpeciesOptions}
                    placeholder="Species..."
                    options={options}
                    value={props.species}
                    onChange={(e, data) => props.setSpecies(data.value as string)} />

                <Button
                    icon="cancel"
                    disabled={!props.species}
                    onClick={() => props.setSpecies("")}  />
            </div>

            <div>
                <ButtonGroup fluid>
                    <Button
                        icon="arrow left"
                        color="red"
                        onClick={previousSpecies} />

                    <Button
                        icon="arrow right"
                        color="violet"
                        onClick={nextSpecies} />
                </ButtonGroup>
            </div>
        </div>
    )
}
