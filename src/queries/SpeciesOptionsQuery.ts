import { gql, useQuery } from "@apollo/client"

import { NamedModel } from "../models/NamedModel"

interface SpeciesOption extends NamedModel {
    order: number
}

interface SpeciesData {
    speciesOptions: SpeciesOption[]
}

interface SpeciesVars {
    languageId: number
}

const getSpeciesOptionsQuery = gql`
    query speciesOptions($languageId: Int) {
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
    const { loading, error, data } = useQuery<SpeciesData, SpeciesVars>(
        getSpeciesOptionsQuery,
        {
            variables: {
                languageId: 9,
            }
        }
    )

    return {
        loadingSpeciesOptions: loading,
        speciesOptionsError: error,
        speciesOptionsData: data,
    }
}
