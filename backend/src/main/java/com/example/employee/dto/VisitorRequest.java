package com.example.employee.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class VisitorRequest {

    private String name;
    private String email;
    private String phone;
    private String companyName;

    private String designation;
    private String cityState;

    private List<String> companyType;
    private String companyTypeOther;

    private List<String> industry;
    private String industryOther;

    private List<String> companySize;

    private List<String> interestAreas;

    private List<String> solutions;
    private String solutionsOther;

    private List<String> timeline;
    private List<String> budget;

    private List<String> followUpMode;
    private List<String> bestTimeToContact;

    private String additionalNotes;
    private Boolean consent;

    private Long exhibitionId;
    private List<Long> productIds;
}
