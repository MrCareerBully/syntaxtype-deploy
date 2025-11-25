package com.syntaxtype.demo.Repository.junctions;

import com.syntaxtype.demo.Entity.CompositeKeys.StudentTopicsId;
import com.syntaxtype.demo.Entity.Junctions.StudentTopics;
import com.syntaxtype.demo.Entity.Users.Student;
import com.syntaxtype.demo.Entity.Lessons.Topics;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StudentTopicsRepository extends JpaRepository<StudentTopics, StudentTopicsId> {
    List<StudentTopics> findByStudent(Student student);
    List<StudentTopics> findByTopic(Topics topic);
    boolean existsByStudentAndTopic(Student student, Topics topic);
}
