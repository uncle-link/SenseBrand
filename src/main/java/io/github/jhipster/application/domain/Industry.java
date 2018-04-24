package io.github.jhipster.application.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;



import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;


/**
 * A Industry.
 */
@Entity
@Table(name = "industry")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "industry")
public class Industry implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;


    @Column(name = "solution_link")
    private String solutionLink;


    @Column(name = "analysis_link")
    private String analysisLink;


    @Column(name = "inventory")
    private String inventory;

    @Column(name = "inventory_url")
    private String inventoryUrl;

    @Column(name = "inventory_content_type")
    private String inventoryContentType;

    @Column(name = "is_show")
    private Boolean isShow;


    @OneToMany(mappedBy = "industry")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<IndustryTop> industryTops = new HashSet<>();

    @OneToMany(mappedBy = "industry")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<IndustryType> industryTypes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Industry name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSolutionLink() {
        return solutionLink;
    }

    public Industry solutionLink(String solutionLink) {
        this.solutionLink = solutionLink;
        return this;
    }

    public void setSolutionLink(String solutionLink) {
        this.solutionLink = solutionLink;
    }

    public String getAnalysisLink() {
        return analysisLink;
    }

    public Industry analysisLink(String analysisLink) {
        this.analysisLink = analysisLink;
        return this;
    }

    public void setAnalysisLink(String analysisLink) {
        this.analysisLink = analysisLink;
    }

    public String getInventory() {
        return inventory;
    }

    public Industry inventory(String inventory) {
        this.inventory = inventory;
        return this;
    }

    public void setInventory(String inventory) {
        this.inventory = inventory;
    }

    public String getInventoryContentType() {
        return inventoryContentType;
    }


    public String getInventoryUrl() {
        return inventoryUrl;
    }



    public Industry inventoryContentType(String inventoryContentType) {
        this.inventoryContentType = inventoryContentType;
        return this;
    }

    public void setInventoryContentType(String inventoryContentType) {
        this.inventoryContentType = inventoryContentType;
    }

    public void setInventoryUrl(String inventoryUrl) {
        this.inventoryUrl = inventoryUrl;
    }


    public Boolean isIsShow() {
        return isShow;
    }

    public Industry isShow(Boolean isShow) {
        this.isShow = isShow;
        return this;
    }

    public void setIsShow(Boolean isShow) {
        this.isShow = isShow;
    }

    public Set<IndustryTop> getIndustryTops() {
        return industryTops;
    }

    public Industry industryTops(Set<IndustryTop> industryTops) {
        this.industryTops = industryTops;
        return this;
    }

    public Industry addIndustryTop(IndustryTop industryTop) {
        this.industryTops.add(industryTop);
        industryTop.setIndustry(this);
        return this;
    }

    public Industry removeIndustryTop(IndustryTop industryTop) {
        this.industryTops.remove(industryTop);
        industryTop.setIndustry(null);
        return this;
    }

    public void setIndustryTops(Set<IndustryTop> industryTops) {
        this.industryTops = industryTops;
    }

    public Set<IndustryType> getIndustryTypes() {
        return industryTypes;
    }

    public Industry industryTypes(Set<IndustryType> industryTypes) {
        this.industryTypes = industryTypes;
        return this;
    }

    public Industry addIndustryType(IndustryType industryType) {
        this.industryTypes.add(industryType);
        industryType.setIndustry(this);
        return this;
    }

    public Industry removeIndustryType(IndustryType industryType) {
        this.industryTypes.remove(industryType);
        industryType.setIndustry(null);
        return this;
    }

    public void setIndustryTypes(Set<IndustryType> industryTypes) {
        this.industryTypes = industryTypes;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Industry industry = (Industry) o;
        if (industry.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), industry.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return "Reader is " + mapper.writeValueAsString(this);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return "error parse Object to json";
    }
}
