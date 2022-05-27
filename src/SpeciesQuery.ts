import { gql, useQuery } from "@apollo/client"

interface Name {
    id: number
    name: string
}

interface Move {
    id: number
    name: string
    names: Name[]
}

interface PokemonMove {
    id: number
    move: Move
}

interface Stat {
    id: number
    name: string
    names: Name[]
}

export interface PokemonStat {
    id: number
    stat: Stat
    baseValue: number
}

interface Type {
    id: number
    name: string
    names: Name[]
}

interface PokemonType {
    id: number
    type: Type
}

interface Variety {
    id: number
    name: string
    moves: PokemonMove[]
    types: PokemonType[]
    stats: PokemonStat[]
}

export interface Species {
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
                id
                name
            }
            varieties: pokemon_v2_pokemons(order_by: {order: asc}) {
                id
                name
                moves: pokemon_v2_pokemonmoves(order_by: {order: asc}) {
                    id
                    move: pokemon_v2_move {
                        id
                        name
                        names: pokemon_v2_movenames(where: {pokemon_v2_language: {id: {_eq: $languageId}}}) {
                            id
                            name
                        }
                    }
                }
                stats: pokemon_v2_pokemonstats(order_by: {stat_id: asc}) {
                    id
                    stat: pokemon_v2_stat {
                        id
                        name
                        names: pokemon_v2_statnames(where: {pokemon_v2_language: {id: {_eq: $languageId}}}) {
                            id
                            name
                        }
                    }
                    baseValue: base_stat
                }
                types: pokemon_v2_pokemontypes(order_by: {slot: asc}) {
                    id
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
