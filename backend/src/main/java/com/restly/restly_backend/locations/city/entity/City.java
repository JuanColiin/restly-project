package com.restly.restly_backend.locations.city.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.restly.restly_backend.locations.state.entity.State;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "CITIES", uniqueConstraints = @UniqueConstraint(columnNames = {"name", "state_id"}))
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class City {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "city_id", nullable = false)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "state_id", nullable = false)
    private State state;
}


