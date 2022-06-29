import { gql, useQuery } from "@apollo/client"

import { NamedModel } from "../models/NamedModel"

interface SpeciesName extends NamedModel {

}

interface EvolutionTreeInfoData {
    speciesInfo: SpeciesName[]
}

interface EvolutionTreeInfoVars {
    speciesNames: string[]
    languageId: number
}

const getEvolutionTreeInfoQuery = gql`
    query evolutionTreeInfo($speciesNames: [String!], $languageId: Int) {
        speciesInfo: pokemon_v2_pokemonspecies(where: {name: {_in: $speciesNames}}, order_by: {id: asc}) {
            id
            name
            names: pokemon_v2_pokemonspeciesnames(where: {pokemon_v2_language: {id: {_eq: $languageId}}}) {
                id
                name
            }
        }
    }
`

export const useEvolutionTreeInfoQuery = (speciesNames: string[]) => {
    const { loading, error, data } = useQuery<EvolutionTreeInfoData, EvolutionTreeInfoVars>(
        getEvolutionTreeInfoQuery,
        {
            variables: {
                speciesNames: speciesNames,
                languageId: 9,
            }
        }
    )

    return {
        loadingEvolutionTreeInfo: loading,
        evolutionTreeInfoError: error,
        evolutionTreeInfoData: data,
    }
}
