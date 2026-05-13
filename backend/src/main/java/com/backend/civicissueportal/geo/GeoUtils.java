package com.backend.civicissueportal.geo;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

public class GeoUtils {

    public record Point(double lng, double lat) {}

    // MultiPolygon -> polygons -> rings -> points
    private static volatile List<List<List<Point>>> apMultiPolygons;

    private static void loadApBoundaryOnce() {
        if (apMultiPolygons != null) return;
        synchronized (GeoUtils.class) {
            if (apMultiPolygons != null) return;
            apMultiPolygons = readMultiPolygonFromGeoJson("/ap_boundary.geojson");
        }
    }

    public static boolean insideAndhraPradesh(double lat, double lng) {
        loadApBoundaryOnce();
        Point p = new Point(lng, lat);

        for (List<List<Point>> polygonRings : apMultiPolygons) {
            if (isPointInPolygonWithHoles(p, polygonRings)) return true;
        }
        return false;
    }

    // Outer ring must contain; point must NOT be inside any hole ring
    private static boolean isPointInPolygonWithHoles(Point p, List<List<Point>> rings) {
        if (rings == null || rings.isEmpty()) return false;
        if (!rayCastingPointInRing(p, rings.get(0))) return false;

        for (int i = 1; i < rings.size(); i++) {
            if (rayCastingPointInRing(p, rings.get(i))) return false; // inside hole => outside polygon
        }
        return true;
    }

    // Ray Casting (Odd-Even rule)
    private static boolean rayCastingPointInRing(Point p, List<Point> ring) {
        boolean inside = false;
        int n = ring.size();
        if (n < 3) return false;

        for (int i = 0, j = n - 1; i < n; j = i++) {
            double xi = ring.get(i).lng, yi = ring.get(i).lat;
            double xj = ring.get(j).lng, yj = ring.get(j).lat;

            boolean intersect = ((yi > p.lat) != (yj > p.lat))
                    && (p.lng < (xj - xi) * (p.lat - yi) / (yj - yi + 0.0) + xi);

            if (intersect) inside = !inside;
        }
        return inside;
    }

    // Haversine distance in KM
    public static double haversineKm(double lat1, double lng1, double lat2, double lng2) {
        final double R = 6371.0088; // km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);

        double a = Math.pow(Math.sin(dLat / 2), 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.pow(Math.sin(dLng / 2), 2);

        double c = 2 * Math.asin(Math.sqrt(a));
        return R * c;
    }

    // Reads Polygon or MultiPolygon GeoJSON from resources
    private static List<List<List<Point>>> readMultiPolygonFromGeoJson(String classpathResource) {
        try (InputStream is = GeoUtils.class.getResourceAsStream(classpathResource)) {
            if (is == null) throw new IllegalStateException("Missing resource: " + classpathResource);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(is);

            JsonNode feature0 = root.path("features").get(0);
            JsonNode geom = feature0.path("geometry");
            String type = geom.path("type").asText();
            JsonNode coords = geom.path("coordinates");

            List<List<List<Point>>> multi = new ArrayList<>();

            if ("Polygon".equalsIgnoreCase(type)) {
                multi.add(parsePolygonRings(coords));
            } else if ("MultiPolygon".equalsIgnoreCase(type)) {
                for (JsonNode polygonNode : coords) {
                    multi.add(parsePolygonRings(polygonNode));
                }
            } else {
                throw new IllegalStateException("Unsupported geometry type: " + type);
            }

            return multi;

        } catch (Exception e) {
            throw new RuntimeException("Failed to load AP boundary GeoJSON", e);
        }
    }

    private static List<List<Point>> parsePolygonRings(JsonNode ringsNode) {
        List<List<Point>> rings = new ArrayList<>();

        for (JsonNode ringNode : ringsNode) {
            List<Point> ring = new ArrayList<>();
            for (JsonNode pt : ringNode) {
                double lng = pt.get(0).asDouble();
                double lat = pt.get(1).asDouble();
                ring.add(new Point(lng, lat));
            }
            rings.add(ring);
        }

        return rings;
    }
}