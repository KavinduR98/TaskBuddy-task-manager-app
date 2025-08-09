package com.ushan.backend.controller;

import com.ushan.backend.dto.request.ChecklistItemRequestDTO;
import com.ushan.backend.dto.request.TaskRequestDTO;
import com.ushan.backend.dto.response.ChecklistItemResponseDTO;
import com.ushan.backend.dto.response.TaskResponseDTO;
import com.ushan.backend.service.TaskService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@Validated
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<List<TaskResponseDTO>> getAllTasks(){
        log.info("GET /api/tasks - Fetching all tasks");
        List<TaskResponseDTO> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(tasks);
    }

    @PostMapping
    public ResponseEntity<TaskResponseDTO> createTask(
            @Valid
            @RequestBody TaskRequestDTO requestDTO
            ){
        log.info("POST /api/tasks - Creating new task");
        TaskResponseDTO createdTask = taskService.createTask(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponseDTO> getTaskById(@PathVariable Long id){
        log.info("GET /api/tasks/{} - Fetching task", id);
        TaskResponseDTO task = taskService.getTaskById(id);
        return ResponseEntity.ok(task);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponseDTO> updateTask(
            @PathVariable Long id,
            @Valid
            @RequestBody TaskRequestDTO requestDTO
    ){
        log.info("PUT /api/tasks/{} - Updating task", id);
        TaskResponseDTO updatedTask = taskService.updateTask(id, requestDTO);
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id){
        log.info("DELETE /api/tasks/{} - Deleting task", id);
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my-tasks/{userId}")
    public ResponseEntity<List<TaskResponseDTO>> getMyTasks(@PathVariable Long userId){
        log.info("GET /api/tasks/my-tasks/{} - Fetching tasks for user", userId);
        List<TaskResponseDTO> tasks = taskService.getMyTasks(userId);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/my-tasks/{userId}/{taskId}")
    public ResponseEntity<TaskResponseDTO> getMyTaskById(
            @PathVariable Long userId,
            @PathVariable Long taskId
    ){
        log.info("GET /api/tasks/my-tasks/{}/{} - Fetching specific task for user", userId, taskId);
        TaskResponseDTO task = taskService.getMyTaskById(userId, taskId);
        return ResponseEntity.ok(task);
    }

    @PutMapping("/{taskId}/checklist/{itemId}")
    public ResponseEntity<ChecklistItemResponseDTO> updateChecklistItem(
            @PathVariable Long taskId,
            @PathVariable Long itemId,
            @RequestBody ChecklistItemRequestDTO itemRequestDTO
    ) {
        log.info("PUT /api/tasks/{}/checklist/{} - Updating checklist item", taskId, itemId);
        ChecklistItemResponseDTO updatedItem = taskService.updateChecklistItem(taskId, itemId, itemRequestDTO);
        return ResponseEntity.ok(updatedItem);
    }
}
