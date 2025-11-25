package com.syntaxtype.demo.Repository.lessons;

import com.syntaxtype.demo.Entity.Lessons.Topics;
import com.syntaxtype.demo.Entity.Users.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface TopicsRepository extends JpaRepository<Topics, Long> {
    List<Topics> findByName(String name);
    List<Topics> findByDescription(String description);
    List<Topics> findByCreatedBy(Teacher createdBy);
}
