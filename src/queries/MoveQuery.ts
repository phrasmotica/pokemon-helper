import { gql, useQuery } from "@apollo/client"

import { FlavourText } from "../models/FlavourText"
import { Move, MoveTarget } from "../models/Move"
import { NamedModel } from "../models/NamedModel"
import { VersionGroup } from "../models/VersionGroup"

interface Item extends NamedModel {

}

interface MoveMetadata {
    criticalHitRate: number
}

interface MoveMachine {
    id: number
    machineNumber: number
    versionGroup: VersionGroup
    item: Item
}

interface MoveDamageClass extends NamedModel {

}

interface MoveWithInformation extends Move {
    accuracy: number | null
    power: number | null
    pp: number
    priority: number
    metadata: MoveMetadata
    machines: MoveMachine[]
    damageClass: MoveDamageClass
    target: MoveTarget
    flavourTexts: FlavourText[]
}

interface MoveData {
    moveInfo: MoveWithInformation[]
}

interface MoveVars {
    id: number
    languageId: number
}

const getMoveQuery = gql`
    query moveInfo($id: Int, $languageId: Int) {
        moveInfo: pokemon_v2_move(where: {id: {_eq: $id}}) {
            id
            name
            names: pokemon_v2_movenames(where: {pokemon_v2_language: {id: {_eq: $languageId}}}) {
                id
                name
            }
            accuracy
            power
            pp
            priority
            metadata: pokemon_v2_movemetum {
                criticalHitRate: crit_rate
            }
            machines: pokemon_v2_machines {
                id
                machineNumber: machine_number
                versionGroup: pokemon_v2_versiongroup {
                    id
                    name
                }
                item: pokemon_v2_item {
                    id
                    name
                    names: pokemon_v2_itemnames(where: {pokemon_v2_language: {id: {_eq: $languageId}}}) {
                        id
                        name
                    }
                }
            }
            damageClass: pokemon_v2_movedamageclass {
                id
                name
                names: pokemon_v2_movedamageclassnames(where: {pokemon_v2_language: {id: {_eq: $languageId}}}) {
                    id
                    name
                }
            }
            target: pokemon_v2_movetarget {
                id
                name
                names: pokemon_v2_movetargetnames(where: {pokemon_v2_language: {id: {_eq: $languageId}}}) {
                    id
                    name
                }
            }
            flavourTexts: pokemon_v2_moveflavortexts(where: {pokemon_v2_language: {id: {_eq: $languageId}}}) {
                id
                versionGroup: pokemon_v2_versiongroup {
                    id
                    name
                }
                text: flavor_text
            }
            type: pokemon_v2_type {
                id
                name
                names: pokemon_v2_typenames(where: {pokemon_v2_language: {id: {_eq: $languageId}}}) {
                    id
                    name
                }
            }
        }
    }
`

export const useMoveQuery = (id: number) => {
    const { loading, error, data } = useQuery<MoveData, MoveVars>(
        getMoveQuery,
        {
            variables: {
                id: id,
                languageId: 9,
            }
        }
    )

    return {
        loadingMove: loading,
        moveError: error,
        moveData: data,
    }
}
