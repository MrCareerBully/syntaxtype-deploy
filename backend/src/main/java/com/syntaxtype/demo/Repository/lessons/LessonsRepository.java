package com.syntaxtype.demo.Repository.lessons;

import com.syntaxtype.demo.Entity.Lessons.Lessons;
import com.syntaxtype.demo.Entity.Lessons.Topics;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LessonsRepository extends JpaRepository<Lessons, Long> {

    List<Lessons> findByTitle(String title);
}
