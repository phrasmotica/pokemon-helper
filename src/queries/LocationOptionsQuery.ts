import { gql, useQuery } from "@apollo/client"

import { LocationArea } from "../models/Encounter"
import { Generation } from "../models/Generation"
import { Region } from "../models/Location"
import { NamedModel } from "../models/NamedModel"

export interface LocationOption extends NamedModel {
    locationAreas: LocationArea[]
    indices: LocationGameIndices[]
    region: Region
}

export interface LocationGameIndices {
    id: number
    index: number
    generation: Generation
}

export const sortLocationOptions = (l1: LocationOption, l2: LocationOption) => {
    if (l1.region.id !== l2.region.id) {
        return l1.region.id - l2.region.id
    }

    let indicesComp = sortLocationGameIndices(l1.indices, l2.indices)
    if (indicesComp !== 0) {
        return indicesComp
    }

    return l1.id - l2.id
}

const sortLocationGameIndices = (i1: LocationGameIndices[], i2: LocationGameIndices[]) => {
    for (let i = 0; i < Math.min(i1.length, i2.length); i++) {
        let comp = sortLocationGameIndexDetails(i1[i], i2[i])
        if (comp !== 0) {
            return comp
        }
    }

    return 0
}

const sortLocationGameIndexDetails = (i1: LocationGameIndices, i2: LocationGameIndices) => {
    if (i1.generation.id !== i2.generation.id) {
        return i1.generation.id - i2.generation.id
    }

    if (i1.index !== i2.index) {
        return i1.index - i2.index
    }

    return i1.id - i2.id
}

interface LocationOptionsData {
    locationOptions: LocationOption[]
}

interface LocationOptionsVars {
    languageId: number
}

const getLocationOptionsQuery = gql`
    query locationOptions($languageId: Int) {
        locationOptions: pokemon_v2_location(order_by: {id: asc}) {
            id
            name
            names: pokemon_v2_locationnames(where: {pokemon_v2_language: {id: {_eq: $languageId}}}) {
                id
                name
            }
            indices: pokemon_v2_locationgameindices {
                id
                index: game_index
                generation: pokemon_v2_generation {
                    id
                    name
                }
            }
            region: pokemon_v2_region {
                id
                name
            }
            locationAreas: pokemon_v2_locationareas {
                id
                name
                names: pokemon_v2_locationareanames(where: {pokemon_v2_language: {id: {_eq: $languageId}}}) {
                    id
                    name
                }
                encountersAgg: pokemon_v2_encounters_aggregate {
                    aggregate {
                        count
                    }
                }
            }
        }
    }
`

export const useLocationOptionsQuery = () => {
    const { loading, error, data } = useQuery<LocationOptionsData, LocationOptionsVars>(
        getLocationOptionsQuery,
        {
            variables: {
                languageId: 9,
            }
        }
    )

    return {
        loadingLocationOptions: loading,
        locationOptionsError: error,
        locationOptionsData: data,
    }
}
