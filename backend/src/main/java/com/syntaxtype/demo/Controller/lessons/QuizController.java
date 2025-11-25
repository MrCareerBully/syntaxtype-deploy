package com.syntaxtype.demo.Controller.lessons;


import com.syntaxtype.demo.Entity.Lessons.Quiz;
import com.syntaxtype.demo.Service.lessons.QuizService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz")
@CrossOrigin(origins = "http://localhost:3000")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping
    public List<Quiz> getAll() {
        return quizService.getAll();
    }

    @GetMapping("/{id}")
    public Quiz getById(@PathVariable Long id) {
        return quizService.getById(id);
    }

    @PostMapping
    public Quiz create(@RequestBody Quiz quiz) {
        return quizService.save(quiz);
    }

    @PutMapping("/{id}")
    public Quiz update(@PathVariable Long id, @RequestBody Quiz updatedQuiz) {
        Quiz quiz = quizService.getById(id);
        if (quiz == null) return null;

        quiz.setTitle(updatedQuiz.getTitle());
        quiz.setItems(updatedQuiz.getItems());
        return quizService.save(quiz);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        quizService.delete(id);
    }
}
