import { gql, useQuery } from "@apollo/client"

import { Species } from "../models/Species"

export interface SpeciesNamesData {
    speciesNameInfo: Species[]
}

interface SpeciesNamesVars {
    languageId: number
}

const getSpeciesNamesQuery = gql`
    query speciesNameInfo($languageId: Int) {
        speciesNameInfo: pokemon_v2_pokemonspecies(order_by: {id: asc}) {
            id
            name
            names: pokemon_v2_pokemonspeciesnames(where: {pokemon_v2_language: {id: {_eq: $languageId}}}) {
                id
                name
                genus
            }
            varieties: pokemon_v2_pokemons(order_by: {id: asc}) {
                id
                name
                isDefault: is_default
                forms: pokemon_v2_pokemonforms(order_by: {form_order: asc}) {
                    id
                    name
                    formName: form_name
                    isDefault: is_default
                    names: pokemon_v2_pokemonformnames(where: {pokemon_v2_language: {id: {_eq: $languageId}}}) {
                        id
                        name
                    }
                }
            }
        }
    }
`

export const useSpeciesNamesQuery = () => {
    const { loading, error, data } = useQuery<SpeciesNamesData, SpeciesNamesVars>(
        getSpeciesNamesQuery,
        {
            variables: {
                languageId: 9,
            },
        }
    )

    return {
        loadingSpeciesNames: loading,
        speciesNamesDataError: error,
        speciesNamesData: data,
    }
}
