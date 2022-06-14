import { useState } from "react"
import { Button, Icon, Modal } from "semantic-ui-react"

import { Generation } from "./models/Generation"
import { VersionGroup } from "./models/VersionGroup"

import { useMoveQuery } from "./queries/MoveQuery"

import { calculateCriticalHitChance, getFlavourText, getName } from "./util/Helpers"

import { MoveTargetIndicator } from "./MoveTargetIndicator"
import { TypeLabel } from "./TypeLabel"

import "./MoveInformation.css"

interface MoveInformationProps {
    moveId: number
    versionGroup: VersionGroup | undefined
}

export const MoveInformation = (props: MoveInformationProps) => {
    const [open, setOpen] = useState(false)

    const { moveData } = useMoveQuery(props.moveId)

    const renderTrigger = (disabled: boolean) => (
        <Button
            className="move-info-button"
            circular
            disabled={disabled}
            size="mini"
            color="blue"
            icon="info" />
    )

    const renderPriority = (p: number) => {
        if (p > 0) {
            let icon = <Icon fitted name="arrow up" />
            return <span>Priority: {icon} (+{p})</span>
        }

        if (p < 0) {
            let icon = <Icon fitted name="arrow down" />
            return <span>Priority: {icon} ({p})</span>
        }

        return <span>Priority: -</span>
    }

    const renderCriticalHitRate = (rate: number, generation: Generation) => {
        if (rate > 0) {
            let chance = calculateCriticalHitChance(rate, generation) * 100

            return (
                <div className="critical-hit-rate">
                    <span>Critical hit rate:</span>
                    &nbsp;
                    <span className="rate">
                        <Icon fitted name="arrow up" />
                    </span>
                    &nbsp;
                    <span className="chance">({chance}%)</span>
                </div>
            )
        }

        return (
            <div className="critical-hit-rate">
                <span>Critical hit rate: -</span>
            </div>
        )
    }

    const move = moveData?.moveInfo[0]
    const versionGroup = props.versionGroup

    if (!move || !versionGroup) {
        return renderTrigger(true)
    }

    let machineNames = "N/A"

    let relevantMachines = move.machines.filter(mm => mm.versionGroup.id === versionGroup.id)
    if (relevantMachines.length > 0) {
        machineNames = relevantMachines.map(mm => getName(mm.item)).join(", ")
    }

    return (
        <Modal
            className="move-info-modal"
            closeIcon
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            trigger={renderTrigger(false)}>
            <Modal.Header>
                <span>{getName(move)}</span>

                <TypeLabel type={move.type} />
            </Modal.Header>

            <Modal.Content>
                <div><span>{getFlavourText(move, versionGroup.id)}</span></div>

                <div>
                    <div><span>Power: {move.power ?? "-"}</span></div>
                    <div><span>Accuracy: {move.accuracy ?? "-"}</span></div>
                    <div><span>PP: {move.pp ?? "-"}</span></div>
                </div>

                <div>
                    <div>
                        {renderPriority(move.priority)}
                    </div>

                    <div>
                        {renderCriticalHitRate(move.metadata.criticalHitRate, versionGroup.generation)}
                    </div>

                    <div><span>Damage Class: {getName(move.damageClass)}</span></div>
                    <div><span>Machine(s): {machineNames}</span></div>
                </div>

                <div className="move-target-indicator-container">
                    <div>
                        <span className="move-target-name">
                            Target: {getName(move.target)}
                        </span>
                    </div>

                    <MoveTargetIndicator target={move.target} />
                </div>
            </Modal.Content>
        </Modal>
    )
}
