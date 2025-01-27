package com.restly.restly_backend.locations.state.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.restly.restly_backend.locations.city.entity.City;
import com.restly.restly_backend.locations.country.entity.Country;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "STATES", uniqueConstraints = @UniqueConstraint(columnNames = {"name", "country_id"}))
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class State {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "state_id")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "country_id", nullable = false)
    private Country country;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "state", orphanRemoval = true)
    private Set<City> cities = new HashSet<>();
}
