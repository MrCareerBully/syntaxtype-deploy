package com.syntaxtype.demo.Controller.lessons;



import com.syntaxtype.demo.DTO.lessons.GalaxyChallengeDTO;
import com.syntaxtype.demo.DTO.lessons.GalaxyChallengePreview;
import com.syntaxtype.demo.Entity.Lessons.GalaxyChallenge;
import com.syntaxtype.demo.Service.lessons.GalaxyChallengeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/challenges/galaxy")
public class GalaxyChallengeController {

    private final GalaxyChallengeService service;

    public GalaxyChallengeController(GalaxyChallengeService service) {
        this.service = service;
    }

    @GetMapping
    public List<GalaxyChallengePreview> getAllChallenge() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public GalaxyChallengeDTO getChallenge(@PathVariable Long id) {
        return service.findByIdNoAnswer(id);
    }

    @GetMapping("/{id}/{questionId}/checkCorrect")
    public boolean checkAnswer(@PathVariable Long id, @PathVariable Long questionId, @RequestParam String selectedChoice) {
        return service.checkifChoiceIsCorrect(id, questionId, selectedChoice);
    }
    

    @PostMapping
    public boolean create(@RequestBody GalaxyChallengeDTO challenge) {
        return service.createGalaxyChallenge(challenge);
    }

    @PutMapping("/{id}")
    public boolean update(@PathVariable Long id, @RequestBody GalaxyChallengeDTO challenge) {
        return service.updateGalaxyChallenge(id, challenge);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
