package com.syntaxtype.demo.Entity.CompositeKeys;

import jakarta.persistence.Embeddable;

import lombok.*;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentTopicsId {
    private Long student;
    private Long topic;
}
