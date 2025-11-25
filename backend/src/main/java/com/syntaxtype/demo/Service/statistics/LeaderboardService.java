package com.syntaxtype.demo.Service.statistics;

import com.syntaxtype.demo.DTO.statistics.LeaderboardDTO;
import com.syntaxtype.demo.Entity.Statistics.Leaderboard;
import com.syntaxtype.demo.Entity.Users.User;
import com.syntaxtype.demo.Entity.Enums.Category;
import com.syntaxtype.demo.Repository.statistics.LeaderboardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LeaderboardService {
    private final LeaderboardRepository leaderboardRepository;

    public List<LeaderboardDTO> findAll() {
        return leaderboardRepository.findAll().stream()
                .map(this::convertToDTO)
                .toList();
    }

    public Optional<LeaderboardDTO> findByLeaderboardId(Long leaderboardId) {
        return leaderboardRepository.findById(leaderboardId)
                .map(this::convertToDTO);
    }

    public Optional<LeaderboardDTO> findByUser(User user) {
        return leaderboardRepository.findByUser(user)
                .map(this::convertToDTO);
    }

    public List<LeaderboardDTO> findByWordsPerMinute(Integer wordsPerMinute) {
        return leaderboardRepository.findByWordsPerMinute(wordsPerMinute).stream()
                .map(this::convertToDTO)
                .toList();
    }

    public List<LeaderboardDTO> findByAccuracy(Integer accuracy) {
        return leaderboardRepository.findByAccuracy(accuracy).stream()
                .map(this::convertToDTO)
                .toList();
    }

    public List<LeaderboardDTO> findByTotalWordsTyped(Integer totalWordsTyped) {
        return leaderboardRepository.findByTotalWordsTyped(totalWordsTyped).stream()
                .map(this::convertToDTO)
                .toList();
    }

    public List<LeaderboardDTO> findByTotalTimeSpent(Integer totalTimeSpent) {
        return leaderboardRepository.findByTotalTimeSpent(totalTimeSpent).stream()
                .map(this::convertToDTO)
                .toList();
    }

    public List<LeaderboardDTO> findByCategory(Category category) {
        return leaderboardRepository.findByCategory(category).stream()
                .map(this::convertToDTO)
                .toList();
    }

    public LeaderboardDTO save(LeaderboardDTO leaderboardDTO, User user) {
        Leaderboard leaderboard = convertFromDTO(leaderboardDTO, user);
        return convertToDTO(leaderboardRepository.save(leaderboard));
    }

    // PATCH: Update words per minute
    public LeaderboardDTO updateWordsPerMinute(Long leaderboardId, Integer newWpm) {
        Optional<Leaderboard> leaderboardOpt = leaderboardRepository.findById(leaderboardId);
        if (leaderboardOpt.isPresent()) {
            Leaderboard leaderboard = leaderboardOpt.get();
            leaderboard.setWordsPerMinute(newWpm);
            return convertToDTO(leaderboardRepository.save(leaderboard));
        }
        return null;
    }

    // PATCH: Update accuracy
    public LeaderboardDTO updateAccuracy(Long leaderboardId, Integer newAccuracy) {
        Optional<Leaderboard> leaderboardOpt = leaderboardRepository.findById(leaderboardId);
        if (leaderboardOpt.isPresent()) {
            Leaderboard leaderboard = leaderboardOpt.get();
            leaderboard.setAccuracy(newAccuracy);
            return convertToDTO(leaderboardRepository.save(leaderboard));
        }
        return null;
    }

    // PATCH: Update total words typed
    public LeaderboardDTO updateTotalWordsTyped(Long leaderboardId, Integer newTotalWordsTyped) {
        Optional<Leaderboard> leaderboardOpt = leaderboardRepository.findById(leaderboardId);
        if (leaderboardOpt.isPresent()) {
            Leaderboard leaderboard = leaderboardOpt.get();
            leaderboard.setTotalWordsTyped(newTotalWordsTyped);
            return convertToDTO(leaderboardRepository.save(leaderboard));
        }
        return null;
    }

    // PATCH: Update total time spent
    public LeaderboardDTO updateTotalTimeSpent(Long leaderboardId, Integer newTotalTimeSpent) {
        Optional<Leaderboard> leaderboardOpt = leaderboardRepository.findById(leaderboardId);
        if (leaderboardOpt.isPresent()) {
            Leaderboard leaderboard = leaderboardOpt.get();
            leaderboard.setTotalTimeSpent(newTotalTimeSpent);
            return convertToDTO(leaderboardRepository.save(leaderboard));
        }
        return null;
    }

    // PATCH: Update category
    public LeaderboardDTO updateCategory(Long leaderboardId, Category newCategory) {
        Optional<Leaderboard> leaderboardOpt = leaderboardRepository.findById(leaderboardId);
        if (leaderboardOpt.isPresent()) {
            Leaderboard leaderboard = leaderboardOpt.get();
            leaderboard.setCategory(newCategory);
            return convertToDTO(leaderboardRepository.save(leaderboard));
        }
        return null;
    }

    public void deleteById(Long id) {
        leaderboardRepository.deleteById(id);
    }

    public LeaderboardDTO convertToDTO(Leaderboard leaderboard) {
        if (leaderboard == null) return null;
        return LeaderboardDTO.builder()
                .leaderboardId(leaderboard.getLeaderboardId())
                .userId(leaderboard.getUser() != null ? leaderboard.getUser().getUserId() : null)
                .wordsPerMinute(leaderboard.getWordsPerMinute())
                .accuracy(leaderboard.getAccuracy())
                .totalWordsTyped(leaderboard.getTotalWordsTyped())
                .totalTimeSpent(leaderboard.getTotalTimeSpent())
                .category(leaderboard.getCategory())
                .build();
    }

    public Leaderboard convertFromDTO(LeaderboardDTO dto, User user) {
        if (dto == null) return null;
        Leaderboard leaderboard = new Leaderboard();
        leaderboard.setLeaderboardId(dto.getLeaderboardId());
        leaderboard.setUser(user);
        leaderboard.setWordsPerMinute(dto.getWordsPerMinute());
        leaderboard.setAccuracy(dto.getAccuracy());
        leaderboard.setTotalWordsTyped(dto.getTotalWordsTyped());
        leaderboard.setTotalTimeSpent(dto.getTotalTimeSpent());
        leaderboard.setCategory(dto.getCategory());
        return leaderboard;
    }
}
