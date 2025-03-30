export const WORLD_GEOJSON_URL = "/world.geo.json"

export const SCENE_COLORS = {
    dark: {
        background: "rgb(16,16,16)",
        map: {
            land: "#323235",
            water: "#000000",
            selectedLand: 0xff0000,
            // highlightedLandColor: 0xff0000,
        },
        ring: '#ffffff',
        backGlow: "#ffffff"
    },
    light: {
        background: "rgb(240,240,240)",
        map: {
            land: "#aaaaaa",
            water: "#ffffff",
            selectedLand: 0xff0000,
            // highlightedLandColor: 0xff0000,
        },
        ring: "#000000",
        backGlow: "#000000"
    }
} as const;