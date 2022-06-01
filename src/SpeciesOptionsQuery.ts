import { gql, useQuery } from "@apollo/client"

import { Name } from "./models/Name"

interface SpeciesOption {
    id: number
    name: string
    order: number
    names: Name[]
}

interface SpeciesData {
    speciesOptions: SpeciesOption[]
}

interface SpeciesVars {
    languageId: number
}

const getSpeciesOptionsQuery = gql`
    query speciesOptions($languageId: Int, $speciesName: String) {
        speciesOptions: pokemon_v2_pokemonspecies(order_by: {id: asc}) {
            id
            name
            order
            names: pokemon_v2_pokemonspeciesnames(where: {pokemon_v2_language: {id: {_eq: $languageId}}}) {
                id
                name
            }
        }
    }
`

export const useSpeciesOptionsQuery = () => {
    const { loading, error, data, refetch } = useQuery<SpeciesData, SpeciesVars>(
        getSpeciesOptionsQuery,
        {
            variables: {
                languageId: 9,
            }
        }
    )

    const refetchSpeciesOptions = () => refetch({
        languageId: 9,
    })

    return {
        loadingSpeciesOptions: loading,
        error,
        speciesOptionsData: data,
        refetchSpeciesOptions
    }
}
