import { gql, useQuery } from "@apollo/client"

import { Region } from "../models/Region"

export interface RegionsData {
    regionInfo: Region[]
}

interface RegionsVars {
    languageId: number
}

const getRegionsQuery = gql`
    query regionInfo($languageId: Int) {
        regionInfo: pokemon_v2_region(order_by: {id: asc}) {
            id
            name
            names: pokemon_v2_regionnames(where: {pokemon_v2_language: {id: {_eq: $languageId}}}) {
                id
                name
            }
        }
    }
`

export const useRegionsQuery = () => {
    const { loading, error, data } = useQuery<RegionsData, RegionsVars>(
        getRegionsQuery,
        {
            variables: {
                languageId: 9,
            },
        }
    )

    return {
        loadingRegions: loading,
        regionsDataError: error,
        regionsData: data,
    }
}
