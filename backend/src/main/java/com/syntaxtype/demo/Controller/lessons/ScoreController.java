package com.syntaxtype.demo.Controller.lessons;

import com.syntaxtype.demo.DTO.lessons.ScoreDTO;
import com.syntaxtype.demo.Repository.lessons.ScoreRepository;
import com.syntaxtype.demo.Service.lessons.ChallengeService;
import com.syntaxtype.demo.Service.lessons.ScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.syntaxtype.demo.Entity.Lessons.Score;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/scores")
public class ScoreController {

    private final ScoreService scoreService;
    private ScoreRepository scoreRepository;

    public ScoreController(ScoreService scoreService) {
        this.scoreService = scoreService;
    }
    @PostMapping
    public ResponseEntity<Score> submitScore(@RequestBody ScoreDTO scoreDTO) {
        Score score = new Score();
        score.setScore(scoreDTO.getScore());
        score.setTimeInSeconds(scoreDTO.getTimeInSeconds());
        score.setChallengeType(scoreDTO.getChallengeType());
        score.setWpm(scoreDTO.getWpm());
        score.setSubmittedAt(LocalDateTime.now());

        return ResponseEntity.ok(scoreService.saveScore(score));
    }


    @PostMapping("/falling")
    public ResponseEntity<Score> submitFallingScore(@RequestBody ScoreDTO req) {
        Score score = new Score();
        score.setScore(req.getScore());
        score.setTimeInSeconds(req.getTimeInSeconds());
        score.setChallengeType("falling");
        score.setWpm(req.getWpm());
        score.setSubmittedAt(LocalDateTime.now());

        return ResponseEntity.ok(scoreService.saveScore(score));
    }
    @GetMapping
    public List<Score> getAllScores() {
        return scoreService.getAllScores();
    }

    // Get all falling scores
    @GetMapping("/falling")
    public List<Score> getFallingScores() {
        return scoreService.getScoresByTypeDesc("falling");
    }


}