import { useState } from "react"
import { Accordion, Icon, Segment } from "semantic-ui-react"

import { Type } from "./models/Type"

import { TypeLabel } from "./TypeLabel"
import { TypeWithEfficacies } from "./TypeQuery"

import "./EfficacyList.css"

interface EfficacyListProps {
    types: TypeWithEfficacies[]
    effectiveTypes: Type[]
}

export const EfficacyList = (props: EfficacyListProps) => {
    const [active, setActive] = useState(false)

    const getDamageFactor = (type: TypeWithEfficacies, targetTypeId: number) => {
        return (type.efficacies.find(t => t.targetTypeId === targetTypeId)?.damageFactor ?? 100) / 100
    }

    const computeEfficacy = (type: TypeWithEfficacies, targetTypeIds: number[]) => {
        let damageFactors = targetTypeIds.map(id => getDamageFactor(type, id))
        return damageFactors.reduce((a, b) => a * b, 1)
    }

    const renderEfficacies = (types: TypeWithEfficacies[], effectiveTypes: Type[]) => {
        let concreteTypes = types.filter(t => t.efficacies.length > 0)
        let effectiveTypeIds = effectiveTypes.map(t => t.id)

        let efficacies = concreteTypes.map(t => ({
            type: t,
            efficacy: computeEfficacy(t, effectiveTypeIds)
        }))

        return (
            <Segment>
                <div className="efficacy-list">
                    {efficacies.map(e => {
                        let strengthClassName = ""
                        if (e.efficacy > 1) {
                            strengthClassName = "strong"
                        }
                        else if (e.efficacy < 1) {
                            strengthClassName = "weak"
                        }

                        return (
                            <div key={e.type.id} className="efficacy">
                                <TypeLabel type={e.type} />

                                <span className={strengthClassName}>
                                    {e.efficacy}x
                                </span>
                            </div>
                        )
                    })}
                </div>
            </Segment>
        )
    }

    let hasEffectiveTypes = props.effectiveTypes.length > 0
    if (!hasEffectiveTypes) {
        return null
    }

    return (
        <Accordion className="efficacy-list-container">
            <Accordion.Title active={active} onClick={() => setActive(!active)}>
                <Icon name="dropdown" />
                Type Effectiveness
            </Accordion.Title>

            <Accordion.Content active={active}>
                {renderEfficacies(props.types, props.effectiveTypes)}
            </Accordion.Content>
        </Accordion>
    )
}
