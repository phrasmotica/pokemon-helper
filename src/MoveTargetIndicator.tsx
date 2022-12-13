import { Icon, SemanticCOLORS, SemanticICONS } from "semantic-ui-react"

import { MoveTarget } from "./models/Move"

import "./MoveTargetIndicator.css"

interface MoveTargetIndicatorProps {
    target: MoveTarget
}

export const MoveTargetIndicator = (props: MoveTargetIndicatorProps) => {
    let enemyCanBeTargeted = [1, 2, 6, 8, 9, 10, 11, 14].includes(props.target.id)
    let allyCanBeTargeted = [1, 2, 3, 4, 5, 9, 10, 13, 14, 15].includes(props.target.id)
    let userCanBeTargeted = [1, 4, 5, 7, 13, 14].includes(props.target.id)

    let className = "move-target-indicator"

    let targetsEntireField = props.target.id === 12
    if (targetsEntireField) {
        className += " filled"
    }

    let enemyIcon = enemyCanBeTargeted ? "circle" : "circle outline"
    let allyIcon = allyCanBeTargeted ? "circle" : "circle outline"
    let userIcon = userCanBeTargeted ? "user" : "user outline"

    // an array indicating whether each combatant can be targeted by the given
    // MoveTarget, and what icon to display
    let targetMatrix = [
        {
            // leftmost enemy
            targeted: enemyCanBeTargeted,
            icon: enemyIcon,
            colour: "red",
        },
        {
            // middle enemy
            targeted: enemyCanBeTargeted,
            icon: enemyIcon,
            colour: "red",
        },
        {
            // rightmost enemy
            targeted: enemyCanBeTargeted,
            icon: enemyIcon,
            colour: "red",
        },
        {
            // left ally
            targeted: allyCanBeTargeted,
            icon: allyIcon,
            colour: "blue",
        },
        {
            // user
            targeted: userCanBeTargeted,
            icon: userIcon,
            colour: "blue",
        },
        {
            // right ally
            targeted: allyCanBeTargeted,
            icon: allyIcon,
            colour: "blue",
        },
    ]

    return (
        <div className={className}>
            {targetMatrix.map((t, i) => (
                <div key={i} className="combatant">
                    <Icon
                        fitted
                        color={t.colour as SemanticCOLORS}
                        size="large"
                        name={t.icon as SemanticICONS} />
                </div>
            ))}
        </div>
    )
}
