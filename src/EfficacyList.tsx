import { useState } from "react"
import { Accordion, Icon, Table } from "semantic-ui-react"

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

    let concreteTypes = props.types.filter(t => t.efficacies.length > 0)

    let effectiveTypeIds = props.effectiveTypes.map(t => t.id)
    let efficacies = concreteTypes.map(t => ({
        type: t,
        efficacy: computeEfficacy(t, effectiveTypeIds)
    }))

    return (
        <Accordion className="efficacy-list-container">
            <Accordion.Title active={active} onClick={() => setActive(!active)}>
                <Icon name="dropdown" />
                Type Effectiveness
            </Accordion.Title>

            <Accordion.Content active={active}>
                <div className="efficacy-list">
                    <Table>
                        <Table.Body>
                            {efficacies.map(e => (
                                <Table.Row key={e.type.id}>
                                    <Table.Cell>
                                        <TypeLabel type={e.type} />
                                    </Table.Cell>

                                    <Table.Cell>
                                        <span>{e.efficacy}x</span>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </div>
            </Accordion.Content>
        </Accordion>
    )
}
