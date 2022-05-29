import { gql, useQuery } from "@apollo/client"

import { Generation } from "./models/Generation"
import { Name } from "./models/Name"
import { Type } from "./models/Type"
import { VersionGroup } from "./models/VersionGroup"

interface PokemonFormType {
    id: number
    type: Type
}

export interface PokemonForm {
    id: number
    name: string
    formName: string
    isDefault: boolean
    names: Name[]
    types: PokemonFormType[]
}

interface LearnMethod {
    id: number
    name: string
    names: Name[]
}

interface Move {
    id: number
    name: string
    names: Name[]
    type: Type
}

export interface PokemonMove {
    id: number
    level: number
    learnMethod: LearnMethod
    move: Move
    versionGroup: VersionGroup
}

interface PokemonTypePast {
    id: number
    generation: Generation
    type: Type
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

interface PokemonType {
    id: number
    type: Type
}

export interface Variety {
    id: number
    name: string
    isDefault: boolean
    forms: PokemonForm[]
    moves: PokemonMove[]
    pastTypes: PokemonTypePast[]
    types: PokemonType[]
    stats: PokemonStat[]
}

export interface Species {
    id: number
    name: string
    order: number
    names: Name[]
    generation: Generation
    varieties: Variety[]
}

export interface SpeciesData {
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
            order
            names: pokemon_v2_pokemonspeciesnames(where: {pokemon_v2_language: {id: {_eq: $languageId}}}) {
                id
                name
            }
            generation: pokemon_v2_generation {
                id
                name
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
                    types: pokemon_v2_pokemonformtypes(order_by: {slot: asc}) {
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
                moves: pokemon_v2_pokemonmoves(order_by: {order: asc}) {
                    id
                    level
                    learnMethod: pokemon_v2_movelearnmethod {
                        id
                        name
                        names: pokemon_v2_movelearnmethodnames(where: {pokemon_v2_language: {id: {_eq: $languageId}}}) {
                            id
                            name
                        }
                    }
                    move: pokemon_v2_move {
                        id
                        name
                        names: pokemon_v2_movenames(where: {pokemon_v2_language: {id: {_eq: $languageId}}}) {
                            id
                            name
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
                    versionGroup: pokemon_v2_versiongroup {
                        id
                        name
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
                pastTypes: pokemon_v2_pokemontypepasts(order_by: {slot: asc}) {
                    id
                    generation: pokemon_v2_generation {
                        id
                        name
                        names: pokemon_v2_generationnames(where: {pokemon_v2_language: {id: {_eq: $languageId}}}) {
                            id
                            name
                        }
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
