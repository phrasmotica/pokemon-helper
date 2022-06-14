import { gql, useQuery } from "@apollo/client"

import { Species } from "../models/Species"

export interface SpeciesData {
    speciesInfo: Species[]
}

interface SpeciesVars {
    speciesName: string
    languageId: number
}

// TODO: put encounters information in a new query?

const getSpeciesQuery = gql`
    query speciesInfo($languageId: Int, $speciesName: String) {
        speciesInfo: pokemon_v2_pokemonspecies(where: {name: {_eq: $speciesName}}, order_by: {id: asc}) {
            id
            name
            order
            genderRate: gender_rate
            captureRate: capture_rate
            names: pokemon_v2_pokemonspeciesnames(where: {pokemon_v2_language: {id: {_eq: $languageId}}}) {
                id
                name
                genus
            }
            flavourTexts: pokemon_v2_pokemonspeciesflavortexts(where: {pokemon_v2_language: {id: {_eq: $languageId}}}) {
                id
                text: flavor_text
                version: pokemon_v2_version {
                    id
                    name
                    names: pokemon_v2_versionnames(where: {pokemon_v2_language: {id: {_eq: $languageId}}}) {
                        id
                        name
                    }
                    versionGroup: pokemon_v2_versiongroup {
                        id
                        name
                    }
                }
            }
            generation: pokemon_v2_generation {
                id
                name
            }
            varieties: pokemon_v2_pokemons(order_by: {id: asc}) {
                id
                name
                isDefault: is_default
                abilities: pokemon_v2_pokemonabilities {
                    id
                    isHidden: is_hidden
                    ability: pokemon_v2_ability {
                        id
                        name
                        names: pokemon_v2_abilitynames(where: {pokemon_v2_language: {id: {_eq: $languageId}}}) {
                            id
                            name
                        }
                        descriptions: pokemon_v2_abilityeffecttexts(where: {pokemon_v2_language: {id: {_eq: $languageId}}}) {
                            id
                            shortEffect: short_effect
                            effect
                        }
                        generation: pokemon_v2_generation {
                            id
                            name
                        }
                    }
                }
                encounters: pokemon_v2_encounters {
                    id
                    minLevel: min_level
                    maxLevel: max_level
                    version: pokemon_v2_version {
                        id
                        name
                        names: pokemon_v2_versionnames(where: {pokemon_v2_language: {id: {_eq: $languageId}}}) {
                            id
                            name
                        }
                    }
                    conditionValues: pokemon_v2_encounterconditionvaluemaps {
                        id
                        value: pokemon_v2_encounterconditionvalue {
                            id
                            isDefault: is_default
                            name
                            names: pokemon_v2_encounterconditionvaluenames(where: {pokemon_v2_language: {id: {_eq: $languageId}}}) {
                                id
                                name
                            }
                        }
                    }
                    locationArea: pokemon_v2_locationarea {
                        id
                        name
                        names: pokemon_v2_locationareanames(where: {pokemon_v2_language: {id: {_eq: $languageId}}}) {
                            id
                            name
                        }
                        location: pokemon_v2_location {
                            id
                            name
                            names: pokemon_v2_locationnames(where: {pokemon_v2_language: {id: {_eq: $languageId}}}) {
                                id
                                name
                            }
                        }
                    }
                    encounterSlot: pokemon_v2_encounterslot {
                        id
                        rarity
                        slot
                        method: pokemon_v2_encountermethod {
                            id
                            name
                            names: pokemon_v2_encountermethodnames(where: {pokemon_v2_language: {id: {_eq: $languageId}}}) {
                                id
                                name
                            }
                        }
                    }
                }
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
    const { loading, error, data } = useQuery<SpeciesData, SpeciesVars>(
        getSpeciesQuery,
        {
            variables: {
                speciesName: speciesName,
                languageId: 9,
            },
            skip: !speciesName
        }
    )

    return {
        loadingSpecies: loading,
        speciesDataError: error,
        speciesData: data,
    }
}
