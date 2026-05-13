package com.backend.civicissueportal.controller;

import com.backend.civicissueportal.dto.NearestAuthorityDto;
import com.backend.civicissueportal.dto.ValidateLocationRequest;
import com.backend.civicissueportal.dto.ValidateLocationResponse;
import com.backend.civicissueportal.geo.GeoUtils;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/issues")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class IssueLocationController {

    // TEMP DATA (Later replace with DB)
    private final List<Authority> authorities = List.of(
            new Authority(1, "Vijayawada Ward Office", 16.5062, 80.6480),
            new Authority(2, "Municipal Zone-2", 16.5200, 80.6300),
            new Authority(3, "Guntur Ward Office", 16.3067, 80.4365)
    );

    record Authority(long id, String name, double lat, double lng) {}

    @PostMapping("/validate-location")
    public ValidateLocationResponse validate(@RequestBody ValidateLocationRequest req) {

        boolean inside = GeoUtils.insideAndhraPradesh(req.lat, req.lng);
        if (!inside) return ValidateLocationResponse.outside();

        List<NearestAuthorityDto> nearest = authorities.stream()
                .map(a -> new NearestAuthorityDto(
                        a.id(),
                        a.name(),
                        round2(GeoUtils.haversineKm(req.lat, req.lng, a.lat(), a.lng()))
                ))
                .sorted(Comparator.comparingDouble(x -> x.distanceKm))
                .limit(5)
                .collect(Collectors.toList());

        return ValidateLocationResponse.inside(nearest);
    }

    private static double round2(double x) {
        return Math.round(x * 100.0) / 100.0;
    }
}