package com.syntaxtype.demo.Repository.lessons;


import com.syntaxtype.demo.Entity.Lessons.QuizItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizItemRepository extends JpaRepository<QuizItem, Long> {
    List<QuizItem> findByQuizId(Long quizId);
}
