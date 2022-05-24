import { gql, useQuery } from "@apollo/client"

interface Name {
    name: string
}

interface Type {
    name: string
}

interface PokemonType {
    id: number
    type: Type
}

interface Stat {
    name: string
}

interface PokemonStat {
    id: number
    stat: Stat
    baseValue: number
}

interface Variety {
    types: PokemonType[]
    stats: PokemonStat[]
}

interface Species {
    id: number
    name: string
    names: Name[]
    varieties: Variety[]
}

interface SpeciesData {
    speciesInfo: Species[]
}

interface SpeciesVars {
    speciesName: string
    languageId: number
}

const getSpeciesQuery = gql`
    query speciesInfo($languageId: Int, $speciesName: String) {
        speciesInfo: pokemon_v2_pokemonspecies(where: {name: {_eq: $speciesName}}, order_by: {id: asc}) {
            id
            name
            names: pokemon_v2_pokemonspeciesnames(where: {pokemon_v2_language: {id: {_eq: $languageId}}}) {
                name
            }
            varieties: pokemon_v2_pokemons(order_by: {order: asc}) {
                stats: pokemon_v2_pokemonstats(order_by: {stat_id: asc}) {
                    id: stat_id
                    stat: pokemon_v2_stat {
                        name
                    }
                    baseValue: base_stat
                }
                types: pokemon_v2_pokemontypes(order_by: {slot: asc}) {
                    id: type_id
                    type: pokemon_v2_type {
                        name
                    }
                }
            }
        }
    }
`

export const useSpeciesQuery = (speciesName: string) => {
    const { loading, error, data, refetch } = useQuery<SpeciesData, SpeciesVars>(
        getSpeciesQuery,
        {
            variables: {
                speciesName: speciesName,
                languageId: 9,
            }
        }
    )

    const refetchSpecies = (speciesName: string) => refetch({
        speciesName: speciesName,
        languageId: 9,
    })

    return {
        loadingSpecies: loading,
        error,
        speciesData: data,
        refetchSpecies
    }
}
