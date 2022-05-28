import { useState } from "react"
import { Button, Input } from "semantic-ui-react"

interface SpeciesSelectorProps {
    loadingSpecies: boolean
    findSpecies: (species: string) => void
}

export const SpeciesSelector = (props: SpeciesSelectorProps) => {
    const [species, setSpecies] = useState("")

    return (
        <div className="species-input-container">
            <Input
                className="species-input"
                placeholder="Species..."
                loading={props.loadingSpecies}
                value={species}
                onChange={(e, data) => setSpecies(data.value)} />

            <div className="find-button-container">
                <Button onClick={() => props.findSpecies(species)}>
                    Find
                </Button>
            </div>
        </div>
    )
}
