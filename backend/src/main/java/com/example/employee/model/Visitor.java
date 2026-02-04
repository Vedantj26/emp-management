package com.example.employee.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(
        name = "visitors",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"email", "exhibition_id"})
        }
)
@Getter
@Setter
@NoArgsConstructor
public class Visitor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String phone;

    private String companyName;
    private String designation;
    private String cityState;

    @ElementCollection
    @CollectionTable(name = "visitor_company_type", joinColumns = @JoinColumn(name = "visitor_id"))
    @Column(name = "company_type")
    private List<String> companyType;

    private String companyTypeOther;

    @ElementCollection
    @CollectionTable(name = "visitor_industry", joinColumns = @JoinColumn(name = "visitor_id"))
    @Column(name = "industry")
    private List<String> industry;

    private String industryOther;

    @ElementCollection
    @CollectionTable(name = "visitor_company_size", joinColumns = @JoinColumn(name = "visitor_id"))
    @Column(name = "company_size")
    private List<String> companySize;

    @ElementCollection
    @CollectionTable(name = "visitor_interest_areas", joinColumns = @JoinColumn(name = "visitor_id"))
    @Column(name = "interest_area")
    private List<String> interestAreas;

    @ElementCollection
    @CollectionTable(name = "visitor_solutions", joinColumns = @JoinColumn(name = "visitor_id"))
    @Column(name = "solution")
    private List<String> solutions;

    private String solutionsOther;

    @ElementCollection
    @CollectionTable(name = "visitor_timeline", joinColumns = @JoinColumn(name = "visitor_id"))
    @Column(name = "timeline")
    private List<String> timeline;

    @ElementCollection
    @CollectionTable(name = "visitor_budget", joinColumns = @JoinColumn(name = "visitor_id"))
    @Column(name = "budget")
    private List<String> budget;

    @ElementCollection
    @CollectionTable(name = "visitor_follow_up_mode", joinColumns = @JoinColumn(name = "visitor_id"))
    @Column(name = "follow_up_mode")
    private List<String> followUpMode;

    @ElementCollection
    @CollectionTable(name = "visitor_best_time", joinColumns = @JoinColumn(name = "visitor_id"))
    @Column(name = "best_time")
    private List<String> bestTimeToContact;

    @Column(columnDefinition = "TEXT")
    private String additionalNotes;

    private Boolean consent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exhibition_id", nullable = false)
    private Exhibition exhibition;

    @OneToMany(mappedBy = "visitor", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<VisitorProduct> visitorProducts;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
