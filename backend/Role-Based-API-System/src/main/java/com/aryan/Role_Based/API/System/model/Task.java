package com.aryan.Role_Based.API.System.model;

import jakarta.persistence.*;
        import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Table(name = "tasks")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Task {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must be less than 255 characters")
    private String title;

    @Size(max = 2000, message = "Description is too long (max 2000 characters)")
    @Column(length = 2000)
    private String description;

    private boolean completed = false;
    private Long ownerId; // user id who created it
}
