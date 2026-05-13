package com.backend.civicissueportal.dto;

public class NearestAuthorityDto {
    public long id;
    public String name;
    public double distanceKm;

    public NearestAuthorityDto(long id, String name, double distanceKm) {
        this.id = id;
        this.name = name;
        this.distanceKm = distanceKm;
    }
}