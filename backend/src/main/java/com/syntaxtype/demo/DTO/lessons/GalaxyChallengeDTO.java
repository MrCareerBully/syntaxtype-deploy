package com.syntaxtype.demo.DTO.lessons;

import java.util.ArrayList;
import java.util.List;

import com.syntaxtype.demo.Entity.Lessons.GalaxyChallengeClasses.QuestionTypes;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GalaxyChallengeDTO {
    private Long id;
    private String title;
    private String description;
    private List<QuestionDTO> questions = new ArrayList<>();

    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionDTO {
        private String question;
        private QuestionTypes type;
        private List<ChoiceDTO> choices = new ArrayList<>();
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChoiceDTO {
        private String choice;
        private Boolean isCorrect;
    }
}