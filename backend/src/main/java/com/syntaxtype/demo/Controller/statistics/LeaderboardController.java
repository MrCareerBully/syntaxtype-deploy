package com.syntaxtype.demo.Controller.statistics;

import com.syntaxtype.demo.DTO.statistics.LeaderboardDTO;
import com.syntaxtype.demo.Entity.Users.User;
import com.syntaxtype.demo.Entity.Enums.Category;
import com.syntaxtype.demo.Service.statistics.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/leaderboards")
@RequiredArgsConstructor
public class LeaderboardController {
    private final LeaderboardService leaderboardService;

    @PreAuthorize("hasAnyRole('ADMIN','TEACHER','STUDENT','USER')")
    @GetMapping
    public ResponseEntity<List<LeaderboardDTO>> getAllLeaderboards() {
        return ResponseEntity.ok(leaderboardService.findAll());
    }

    @PreAuthorize("hasAnyRole('ADMIN','TEACHER','STUDENT','USER')")
    @GetMapping("/{leaderboardId}")
    public ResponseEntity<Optional<LeaderboardDTO>> getById(@PathVariable Long leaderboardId) {
        return ResponseEntity.ok(leaderboardService.findByLeaderboardId(leaderboardId));
    }

    @PreAuthorize("hasAnyRole('ADMIN','TEACHER','STUDENT','USER')")
    @GetMapping("/user")
    public ResponseEntity<Optional<LeaderboardDTO>> getByUser(@RequestBody User user) {
        return ResponseEntity.ok(leaderboardService.findByUser(user));
    }

    @PreAuthorize("hasAnyRole('ADMIN','TEACHER','STUDENT','USER')")
    @GetMapping("/words-per-minute/{wpm}")
    public ResponseEntity<List<LeaderboardDTO>> getByWordsPerMinute(@PathVariable Integer wpm) {
        return ResponseEntity.ok(leaderboardService.findByWordsPerMinute(wpm));
    }

    @PreAuthorize("hasAnyRole('ADMIN','TEACHER','STUDENT','USER')")
    @GetMapping("/accuracy/{accuracy}")
    public ResponseEntity<List<LeaderboardDTO>> getByAccuracy(@PathVariable Integer accuracy) {
        return ResponseEntity.ok(leaderboardService.findByAccuracy(accuracy));
    }

    @PreAuthorize("hasAnyRole('ADMIN','TEACHER','STUDENT','USER')")
    @GetMapping("/total-words-typed/{totalWordsTyped}")
    public ResponseEntity<List<LeaderboardDTO>> getByTotalWordsTyped(@PathVariable Integer totalWordsTyped) {
        return ResponseEntity.ok(leaderboardService.findByTotalWordsTyped(totalWordsTyped));
    }

    @PreAuthorize("hasAnyRole('ADMIN','TEACHER','STUDENT','USER')")
    @GetMapping("/total-time-spent/{totalTimeSpent}")
    public ResponseEntity<List<LeaderboardDTO>> getByTotalTimeSpent(@PathVariable Integer totalTimeSpent) {
        return ResponseEntity.ok(leaderboardService.findByTotalTimeSpent(totalTimeSpent));
    }

    @PreAuthorize("hasAnyRole('ADMIN','TEACHER','STUDENT','USER')")
    @GetMapping("/category/{category}")
    public ResponseEntity<List<LeaderboardDTO>> getByCategory(@PathVariable Category category) {
        return ResponseEntity.ok(leaderboardService.findByCategory(category));
    }

    @PreAuthorize("hasAnyRole('ADMIN','TEACHER','STUDENT','USER')")
    @PostMapping
    public ResponseEntity<LeaderboardDTO> createLeaderboard(@RequestBody LeaderboardDTO leaderboardDTO, @RequestParam Long userId) {
        User user = new User();
        user.setUserId(userId);
        return ResponseEntity.ok(leaderboardService.save(leaderboardDTO, user));
    }

    @PreAuthorize("hasAnyRole('ADMIN','TEACHER','STUDENT','USER')")
    @PatchMapping("/{leaderboardId}/words-per-minute")
    public ResponseEntity<LeaderboardDTO> updateWordsPerMinute(@PathVariable Long leaderboardId, @RequestParam Integer newWpm) {
        LeaderboardDTO updated = leaderboardService.updateWordsPerMinute(leaderboardId, newWpm);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @PreAuthorize("hasAnyRole('ADMIN','TEACHER','STUDENT','USER')")
    @PatchMapping("/{leaderboardId}/accuracy")
    public ResponseEntity<LeaderboardDTO> updateAccuracy(@PathVariable Long leaderboardId, @RequestParam Integer newAccuracy) {
        LeaderboardDTO updated = leaderboardService.updateAccuracy(leaderboardId, newAccuracy);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @PreAuthorize("hasAnyRole('ADMIN','TEACHER','STUDENT','USER')")
    @PatchMapping("/{leaderboardId}/total-words-typed")
    public ResponseEntity<LeaderboardDTO> updateTotalWordsTyped(@PathVariable Long leaderboardId, @RequestParam Integer newTotalWordsTyped) {
        LeaderboardDTO updated = leaderboardService.updateTotalWordsTyped(leaderboardId, newTotalWordsTyped);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @PreAuthorize("hasAnyRole('ADMIN','TEACHER','STUDENT','USER')")
    @PatchMapping("/{leaderboardId}/total-time-spent")
    public ResponseEntity<LeaderboardDTO> updateTotalTimeSpent(@PathVariable Long leaderboardId, @RequestParam Integer newTotalTimeSpent) {
        LeaderboardDTO updated = leaderboardService.updateTotalTimeSpent(leaderboardId, newTotalTimeSpent);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @PreAuthorize("hasAnyRole('ADMIN','TEACHER','STUDENT','USER')")
    @PatchMapping("/{leaderboardId}/category")
    public ResponseEntity<LeaderboardDTO> updateCategory(@PathVariable Long leaderboardId, @RequestParam Category newCategory) {
        LeaderboardDTO updated = leaderboardService.updateCategory(leaderboardId, newCategory);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @PreAuthorize("hasAnyRole('ADMIN','TEACHER','STUDENT','USER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        leaderboardService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
