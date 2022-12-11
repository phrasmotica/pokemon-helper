import { gql, useQuery } from "@apollo/client"
import { LocationArea } from "../models/Encounter"

import { NamedModel } from "../models/NamedModel"

export interface LocationOption extends NamedModel {
    locationAreas: LocationArea[]
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
