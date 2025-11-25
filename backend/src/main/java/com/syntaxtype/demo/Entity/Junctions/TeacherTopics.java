package com.syntaxtype.demo.Entity.Junctions;

import java.io.Serializable;

import com.syntaxtype.demo.Entity.CompositeKeys.TeacherTopicsId;
import com.syntaxtype.demo.Entity.Lessons.Topics;
import com.syntaxtype.demo.Entity.Users.Teacher;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "teacher_topics")
@Builder
public class TeacherTopics implements Serializable{
    @EmbeddedId
    @Id
    private TeacherTopicsId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("teacher")
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("topic")
    @JoinColumn(name = "topic_id")
    private Topics topic;
}