import { gql, useQuery } from "@apollo/client"

import { VersionGroup } from "./models/VersionGroup"

interface VersionGroupData {
    versionGroupInfo: VersionGroup[]
}

interface VersionGroupVars {
    languageId: number
}

const getVersionGroupsQuery = gql`
    query versionGroupInfo($languageId: Int) {
        versionGroupInfo: pokemon_v2_versiongroup(order_by: {order: asc}) {
            id
            name
            generation: pokemon_v2_generation {
                id
                name
                names: pokemon_v2_generationnames(where: {pokemon_v2_language: {id: {_eq: $languageId}}}) {
                    id
                    name
                }
            }
            versions: pokemon_v2_versions {
                id
                name
                names: pokemon_v2_versionnames(where: {pokemon_v2_language: {id: {_eq: $languageId}}}) {
                    id
                    name
                }
            }
        }
    }
`

export const useVersionGroupsQuery = () => {
    const { loading, error, data, refetch } = useQuery<VersionGroupData, VersionGroupVars>(
        getVersionGroupsQuery,
        {
            variables: {
                languageId: 9,
            }
        }
    )

    const refetchVersionGroups = () => refetch({
        languageId: 9,
    })

    return {
        loadingVersionGroups: loading,
        versionGroupsError: error,
        versionGroupsData: data,
        refetchVersionGroups
    }
}
