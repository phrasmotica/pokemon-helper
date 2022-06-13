import { Encounter, EncounterConditionValueMap } from "../models/Encounter"
import { VersionGroup } from "../models/VersionGroup"
import { canBeMerged, getVersionGroupName } from "./Helpers"

describe("canBeMerged", () => {
    it("matches empty conditions with default conditions", () => {
        let e = {
            conditionValues: [] as EncounterConditionValueMap[],
        } as Encounter

        let f = {
            conditionValues: [
                {
                    value: {
                        isDefault: true,
                    },
                },
            ],
        } as Encounter

        let result = canBeMerged(e, f)
        expect(result).toBe(true)
    })

    it("matches arbitrary default conditions", () => {
        let e = {
            conditionValues: [
                {
                    value: {
                        isDefault: true,
                    },
                },
                {
                    value: {
                        isDefault: true,
                    },
                },
                {
                    value: {
                        isDefault: true,
                    },
                },
            ],
        } as Encounter

        let f = {
            conditionValues: [
                {
                    value: {
                        isDefault: true,
                    },
                },
                {
                    value: {
                        isDefault: true,
                    },
                },
            ],
        } as Encounter

        let result = canBeMerged(e, f)
        expect(result).toBe(true)
    })

    it("matches equal sets of conditions", () => {
        let e = {
            conditionValues: [
                {
                    value: {
                        id: 2,
                        isDefault: false,
                    },
                },
                {
                    value: {
                        id: 3,
                        isDefault: false,
                    },
                },
            ],
        } as Encounter

        let f = {
            conditionValues: [
                {
                    value: {
                        id: 3,
                        isDefault: false,
                    },
                },
                {
                    value: {
                        id: 2,
                        isDefault: false,
                    },
                },
            ],
        } as Encounter

        let result = canBeMerged(e, f)
        expect(result).toBe(true)
    })

    it("does not match different sets of conditions", () => {
        let e = {
            conditionValues: [
                {
                    value: {
                        id: 2,
                        isDefault: false,
                    },
                },
                {
                    value: {
                        id: 1,
                        isDefault: true,
                    },
                },
            ],
        } as Encounter

        let f = {
            conditionValues: [
                {
                    value: {
                        id: 1,
                        isDefault: true,
                    },
                },
                {
                    value: {
                        id: 3,
                        isDefault: false,
                    },
                },
            ],
        } as Encounter

        let result = canBeMerged(e, f)
        expect(result).toBe(false)
    })
})

describe("getVersionGroupName", () => {
    it("computes a version group's name correctly", () => {
        let versionGroup = {
            versions: [
                {
                    names: [
                        {
                            name: "Version 1",
                        },
                    ],
                },
                {
                    names: [
                        {
                            name: "Version 2",
                        },
                    ],
                },
            ],
        } as VersionGroup

        let versionGroupName = getVersionGroupName(versionGroup)
        expect(versionGroupName).toEqual("Version 1/Version 2")
    })
})
