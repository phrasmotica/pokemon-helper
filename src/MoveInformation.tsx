import { useState } from "react"
import { Button, Icon, Modal } from "semantic-ui-react"

import { useMoveQuery } from "./queries/MoveQuery"

import { getFlavourText, getName } from "./Helpers"
import { MoveTargetIndicator } from "./MoveTargetIndicator"
import { TypeLabel } from "./TypeLabel"

import "./MoveInformation.css"

interface MoveInformationProps {
    moveId: number
    versionGroupId: number | undefined
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

    const move = moveData?.moveInfo[0]

    if (!move) {
        return renderTrigger(true)
    }

    let machineNames = "N/A"

    let relevantMachines = move.machines.filter(mm => !props.versionGroupId || mm.versionGroup.id === props.versionGroupId)
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
                <div><span>{getFlavourText(move, props.versionGroupId)}</span></div>

                <div>
                    <div><span>Power: {move.power ?? "-"}</span></div>
                    <div><span>Accuracy: {move.accuracy ?? "-"}</span></div>
                    <div><span>PP: {move.pp ?? "-"}</span></div>
                </div>

                <div>
                    <div>
                        {renderPriority(move.priority)}
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
