package com.syntaxtype.demo.Service.lessons;

import com.syntaxtype.demo.Entity.Enums.ChallengeType;
import com.syntaxtype.demo.Entity.Lessons.Challenge;
import com.syntaxtype.demo.Repository.lessons.ChallengeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChallengeService {

    @Autowired
    private ChallengeRepository repository;

    public Challenge save(Challenge challenge) {
        return repository.save(challenge);
    }

    public Challenge findById(Long id) {
        return repository.findById(id).orElse(null);
    }

    // 👇 Additional methods
    public List<Challenge> getAllNormalChallenges() {
        return repository.findByType(ChallengeType.PARAGRAPH);
    }

    public List<Challenge> getAllFallingChallenges() {
        return repository.findByType(ChallengeType.FALLING_TYPING_TEST);
    }

    public Challenge getNormalChallengeById(Long id) {
        return repository.findBychallengeIdAndType(id, ChallengeType.PARAGRAPH).orElse(null);
    }

    public Challenge getFallingChallengeById(Long id) {
        return repository.findBychallengeIdAndType(id, ChallengeType.FALLING_TYPING_TEST).orElse(null);
    }

    public List<Challenge> findAll() {
        return repository.findAll();
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    public List<Challenge> getAllAdvancedFallingChallenges() {
        // Just get all challenges - no enum filtering here
        return repository.findAll();
    }

    public Challenge getAdvancedFallingChallengeById(Long id) {
        return repository.findById(id).orElse(null);
    }
}