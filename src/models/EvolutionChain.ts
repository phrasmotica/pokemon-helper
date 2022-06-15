export interface EvolutionChain {
    id: number
    baby_trigger_item: NamedResource
    chain: ChainLink
}

export interface ChainLink {
    is_baby: boolean
    species: NamedResource
    evolution_details: EvolutionDetail[]
    evolves_to: ChainLink[]
}

export interface EvolutionDetail {
    item: NamedResource | null
    trigger: NamedResource
    gender: number | null
    held_item: NamedResource | null
    known_move: NamedResource | null
    known_move_type: NamedResource | null
    location: NamedResource | null
    min_level: number | null
    min_happiness: number | null
    min_beauty: number | null
    min_affection: number | null
    needs_overworld_rain: boolean
    party_species: NamedResource | null
    party_type: NamedResource | null
    relative_physical_stats: number | null
    time_of_day: string
    trade_species: NamedResource | null
    turn_upside_down: boolean
}

export interface NamedResource {
    name: string
}
