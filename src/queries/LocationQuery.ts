import { gql, useQuery } from "@apollo/client"

import { Location } from "../models/Location"

export interface LocationData {
    locationInfo: Location[]
}

interface LocationVars {
    languageId: number
    locationName: string
}

const getLocationQuery = gql`
    query locationInfo($languageId: Int, $locationName: String) {
        locationInfo: pokemon_v2_location(where: {name: {_eq: $locationName}}, order_by: {id: asc}) {
            id
            name
            names: pokemon_v2_locationnames(where: {pokemon_v2_language: {id: {_eq: $languageId}}}) {
                id
                name
            }
            region: pokemon_v2_region {
                id
                name
                names: pokemon_v2_regionnames(where: {pokemon_v2_language: {id: {_eq: $languageId}}}) {
                    id
                    name
                }
            }
            areas: pokemon_v2_locationareas {
                id
                name
                names: pokemon_v2_locationareanames(where: {pokemon_v2_language: {id: {_eq: $languageId}}}) {
                    id
                    name
                }
                encounters: pokemon_v2_encounters {
                    id
                    minLevel: min_level
                    maxLevel: max_level
                    pokemon: pokemon_v2_pokemon {
                        id
                        name
                        species: pokemon_v2_pokemonspecy {
                            id
                            name
                        }
                    }
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
            }
        }
    }
`

export const useLocationQuery = (locationName: string) => {
    const { loading, error, data } = useQuery<LocationData, LocationVars>(
        getLocationQuery,
        {
            variables: {
                locationName: locationName,
                languageId: 9,
            },
            skip: !locationName
        }
    )

    return {
        loadingLocation: loading,
        locationDataError: error,
        locationData: data,
    }
}
