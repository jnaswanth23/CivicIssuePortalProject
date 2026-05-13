package com.backend.civicissueportal.dto;

import java.util.List;

public class ValidateLocationResponse {
    public boolean insideAP;
    public String message;
    public List<NearestAuthorityDto> nearest;

    public static ValidateLocationResponse outside() {
        ValidateLocationResponse r = new ValidateLocationResponse();
        r.insideAP = false;
        r.message = "Location is outside Andhra Pradesh.";
        r.nearest = List.of();
        return r;
    }

    public static ValidateLocationResponse inside(List<NearestAuthorityDto> nearest) {
        ValidateLocationResponse r = new ValidateLocationResponse();
        r.insideAP = true;
        r.message = null;
        r.nearest = nearest;
        return r;
    }
}