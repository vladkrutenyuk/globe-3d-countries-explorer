declare global {
	type Position = [longitude: number, latitude: number]; // [longitude, latitude]

	/** Point (одна координата) */
	interface GeoJsonPoint {
		type: "Point";
		coordinates: Position;
	}

	/** LineString (линия из точек) */
	interface GeoJsonLineString {
		type: "LineString";
		coordinates: Position[];
	}

	/** Polygon (многоугольник с внешним контуром и возможными внутренними контурами) */
	interface GeoJsonPolygon {
		type: "Polygon";
		coordinates: Position[][]; // Внешний контур и внутренние кольца (если есть)
	}

	/** MultiPolygon (несколько полигонов) */
	interface GeoJsonMultiPolygon {
		type: "MultiPolygon";
		coordinates: Position[][][]; // Массив полигонов, каждый из которых содержит внешнее кольцо и внутренние кольца
	}

	type GeoJsonGeometry =
		| GeoJsonPoint
		| GeoJsonLineString
		| GeoJsonPolygon
		| GeoJsonMultiPolygon;

	interface GeoJsonFeature {
		type: "Feature";
		geometry: GeoJsonGeometry;
		properties: Record<string, string | number | null>;
		id?: string | number;
	}

	type GeoJsonFeatureCollection = {
		type: "FeatureCollection";
		features: GeoJsonFeature[];
	};
}

export {};
