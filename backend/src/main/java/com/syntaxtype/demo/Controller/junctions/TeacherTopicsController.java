package com.syntaxtype.demo.Controller.junctions;

import com.syntaxtype.demo.DTO.junctions.TeacherTopicsDTO;
import com.syntaxtype.demo.Entity.CompositeKeys.TeacherTopicsId;
import com.syntaxtype.demo.Entity.Users.Teacher;
import com.syntaxtype.demo.Entity.Lessons.Topics;
import com.syntaxtype.demo.Service.junctions.TeacherTopicsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher-topics")
@RequiredArgsConstructor
public class TeacherTopicsController {
    private final TeacherTopicsService teacherTopicsService;

    @GetMapping
    public List<TeacherTopicsDTO> getAllTeacherTopics() {
        return teacherTopicsService.findAll();
    }

    @GetMapping("/teacher/{teacherId}")
    public List<TeacherTopicsDTO> getByTeacher(@PathVariable Long teacherId) {
        Teacher teacher = new Teacher();
        teacher.setTeacherId(teacherId);
        return teacherTopicsService.findByTeacher(teacher);
    }

    @GetMapping("/topic/{topicId}")
    public List<TeacherTopicsDTO> getByTopic(@PathVariable Long topicId) {
        Topics topic = new Topics();
        topic.setTopicId(topicId);
        return teacherTopicsService.findByTopic(topic);
    }

    @PostMapping
    public TeacherTopicsDTO createTeacherTopics(@RequestBody TeacherTopicsDTO dto) {
        Teacher teacher = new Teacher();
        teacher.setTeacherId(dto.getTeacherId());
        Topics topic = new Topics();
        topic.setTopicId(dto.getTopicId());
        return teacherTopicsService.save(dto, teacher, topic);
    }

    @PatchMapping("/{teacherId}/{topicId}/teacher")
    public TeacherTopicsDTO updateTeacher(@PathVariable Long teacherId, @PathVariable Long topicId, @RequestBody Long newTeacherId) {
        TeacherTopicsId id = new TeacherTopicsId(teacherId, topicId);
        Teacher newTeacher = new Teacher();
        newTeacher.setTeacherId(newTeacherId);
        return teacherTopicsService.updateTeacher(id, newTeacher);
    }

    @PatchMapping("/{teacherId}/{topicId}/topic")
    public TeacherTopicsDTO updateTopic(@PathVariable Long teacherId, @PathVariable Long topicId, @RequestBody Long newTopicId) {
        TeacherTopicsId id = new TeacherTopicsId(teacherId, topicId);
        Topics newTopic = new Topics();
        newTopic.setTopicId(newTopicId);
        return teacherTopicsService.updateTopic(id, newTopic);
    }

    @DeleteMapping("/{teacherId}/{topicId}")
    public void deleteTeacherTopics(@PathVariable Long teacherId, @PathVariable Long topicId) {
        TeacherTopicsId id = new TeacherTopicsId(teacherId, topicId);
        teacherTopicsService.deleteById(id);
    }
}
