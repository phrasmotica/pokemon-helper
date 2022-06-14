import { Species } from "./models/Species"
import { VersionGroup } from "./models/VersionGroup"

import { getCleanFlavourText, getName } from "./util/Helpers"

import "./SpeciesFlavourText.css"

interface SpeciesFlavourTextProps {
    speciesInfo: Species | undefined
    versionGroup: VersionGroup | undefined
}

export const SpeciesFlavourText = (props: SpeciesFlavourTextProps) => {
    let species = props.speciesInfo
    let versionGroup = props.versionGroup

    if (!species || !versionGroup) {
        return null
    }

    let relevantFlavourTexts = species.flavourTexts.filter(ft => ft.version.versionGroup.id === versionGroup!.id)

    if (relevantFlavourTexts.length <= 0) {
        return (
            <div className="species-flavour-text">
                <span>No flavour text to show!</span>
            </div>
        )
    }

    return (
        <div className="species-flavour-text">
            {relevantFlavourTexts.map(ft => (
                <div key={ft.id}>
                    <span><b>{getName(ft.version)}</b></span>
                    <br />
                    <span>{getCleanFlavourText(ft)}</span>
                </div>
            ))}
        </div>
    )
}
