import { Dropdown } from "semantic-ui-react"

import { getName } from "./Helpers"
import { useSpeciesOptionsQuery } from "./SpeciesOptionsQuery"
import { Species } from "./SpeciesQuery"

interface SpeciesSelectorProps {
    species: Species | undefined
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
        <Dropdown
            fluid
            selection
            search
            className="species-input"
            loading={props.loadingSpecies || loadingSpeciesOptions}
            placeholder="Species..."
            options={options}
            value={props.species?.name}
            onChange={(e, data) => props.setSpecies(data.value as string)} />
    )
}
