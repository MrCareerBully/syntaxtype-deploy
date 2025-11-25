package com.syntaxtype.demo.Repository.lessons;



import com.syntaxtype.demo.Entity.Lessons.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizRepository extends JpaRepository<Quiz, Long> {}
