import { gql, useQuery } from "@apollo/client"

import { Type } from "../models/Type"

interface TypeEfficacy {
    id: number
    targetTypeId: number
    damageFactor: number
}

export interface TypeWithEfficacies extends Type {
    efficacies: TypeEfficacy[]
}

interface TypeData {
    typeInfo: TypeWithEfficacies[]
}

interface TypeVars {
    languageId: number
}

const getTypesQuery = gql`
    query typeInfo($languageId: Int) {
        typeInfo: pokemon_v2_type(order_by: {id: asc}) {
            id
            name
            names: pokemon_v2_typenames(where: {pokemon_v2_language: {id: {_eq: $languageId}}}) {
                id
                name
            }
            generation: pokemon_v2_generation {
                id
                name
            }
            efficacies: pokemon_v2_typeefficacies {
                id
                targetTypeId: target_type_id
                damageFactor: damage_factor
            }
        }
    }
`

export const useTypesQuery = () => {
    const { loading, error, data } = useQuery<TypeData, TypeVars>(
        getTypesQuery,
        {
            variables: {
                languageId: 9,
            }
        }
    )

    return {
        loadingTypes: loading,
        typesError: error,
        typesData: data,
    }
}
