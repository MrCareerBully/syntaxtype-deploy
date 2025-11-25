package com.syntaxtype.demo.Entity.Lessons;

import lombok.*;

import org.springframework.lang.NonNull;

import com.syntaxtype.demo.Entity.Users.Teacher;

import jakarta.persistence.*;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "topics")
@Builder
public class Topics {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long topicId;


    private String name;

    private String description;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id")
    private Teacher createdBy;
}