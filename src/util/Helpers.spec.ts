import { getVersionGroupName } from "./Helpers"

describe("getVersionGroupName", () => {
    it("computes a version group's name correctly", () => {
        let versionGroup = {
            id: 1,
            name: "versionGroup",
            generation: {
                id: 1,
                name: "generation",
                names: []
            },
            versions: [
                {
                    id: 1,
                    name: "version1",
                    names: [
                        {
                            id: 8,
                            name: "Version 1",
                        },
                    ],
                },
                {
                    id: 2,
                    name: "version2",
                    names: [
                        {
                            id: 9,
                            name: "Version 2",
                        },
                    ],
                },
            ],
        }

        let versionGroupName = getVersionGroupName(versionGroup)
        expect(versionGroupName).toEqual("Version 1/Version 2")
    })
})
