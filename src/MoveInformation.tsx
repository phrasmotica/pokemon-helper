import { useState } from "react"
import { Button, Modal } from "semantic-ui-react"

import { Move } from "./models/Move"

import { getFlavourText, getName } from "./Helpers"
import { useMoveQuery } from "./MoveQuery"
import { TypeLabel } from "./TypeLabel"

import "./MoveInformation.css"

interface MoveInformationProps {
    move: Move
    versionGroupId: number | undefined
}

export const MoveInformation = (props: MoveInformationProps) => {
    const [open, setOpen] = useState(false)

    const { moveData } = useMoveQuery(props.move.id)

    const move = moveData?.moveInfo[0]

    const renderTrigger = (disabled: boolean) => (
        <Button
            className="move-info-button"
            circular
            disabled={disabled}
            size="mini"
            color="blue"
            icon="info" />
    )

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
                    <div><span>Priority: {move.priority ?? "-"}</span></div>
                    <div><span>Damage Class: {getName(move.damageClass)}</span></div>
                    <div><span>Target: {getName(move.target)}</span></div>
                </div>

                <div>
                    <div><span>Machine(s): {machineNames}</span></div>
                </div>
            </Modal.Content>
        </Modal>
    )
}
