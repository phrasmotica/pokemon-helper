import { Button, Dropdown } from "semantic-ui-react"

import { getName } from "./Helpers"
import { useSpeciesOptionsQuery } from "./SpeciesOptionsQuery"

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

    return (
        <div className="species-selector-container">
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
    )
}
