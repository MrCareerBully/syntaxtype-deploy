package com.syntaxtype.demo.DTO.lessons;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopicsDTO {
    private Long topicId;
    private String name;
    private String description;
    private Long createdById;
}
