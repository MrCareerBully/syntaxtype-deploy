package com.syntaxtype.demo.Entity.Junctions;

import java.io.Serializable;

import com.syntaxtype.demo.Entity.CompositeKeys.StudentTopicsId;
import com.syntaxtype.demo.Entity.Lessons.Topics;
import com.syntaxtype.demo.Entity.Users.Student;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "student_topics")
@Builder
public class StudentTopics implements Serializable{
    @EmbeddedId
    @Id
    private StudentTopicsId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("student")
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("topic")
    @JoinColumn(name = "topic_id")
    private Topics topic;
}