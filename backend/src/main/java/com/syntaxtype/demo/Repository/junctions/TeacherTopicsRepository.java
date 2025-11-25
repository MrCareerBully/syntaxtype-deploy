package com.syntaxtype.demo.Repository.junctions;

import com.syntaxtype.demo.Entity.CompositeKeys.TeacherTopicsId;
import com.syntaxtype.demo.Entity.Junctions.TeacherTopics;
import com.syntaxtype.demo.Entity.Users.Teacher;
import com.syntaxtype.demo.Entity.Lessons.Topics;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TeacherTopicsRepository extends JpaRepository<TeacherTopics, TeacherTopicsId> {
    List<TeacherTopics> findByTeacher(Teacher teacher);
    List<TeacherTopics> findByTopic(Topics topic);
    boolean existsByTeacherAndTopic(Teacher teacher, Topics topic);
}
