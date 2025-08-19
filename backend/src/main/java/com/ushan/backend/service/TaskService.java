package com.ushan.backend.service;

import com.ushan.backend.dto.request.ChecklistItemRequestDTO;
import com.ushan.backend.dto.request.TaskRequestDTO;
import com.ushan.backend.dto.response.ChecklistItemResponseDTO;
import com.ushan.backend.dto.response.UserSummaryDTO;
import com.ushan.backend.dto.response.TaskResponseDTO;
import com.ushan.backend.entity.ChecklistItem;
import com.ushan.backend.entity.Task;
import com.ushan.backend.entity.User;
import com.ushan.backend.exception.ResourceNotFoundException;
import com.ushan.backend.repository.ChecklistItemRepository;
import com.ushan.backend.repository.TaskRepository;
import com.ushan.backend.repository.UserRepository;
import com.ushan.backend.util.TaskStatus;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Slf4j
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ChecklistItemRepository checklistItemRepository;
    private final ModelMapper modelMapper;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository, ChecklistItemRepository checklistItemRepository, ModelMapper modelMapper) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.checklistItemRepository = checklistItemRepository;
        this.modelMapper = modelMapper;
    }

    @Transactional(readOnly = true)
    public List<TaskResponseDTO> getAllTasks(){
        log.info("Fetching all tasks");
        List<Task> tasks = taskRepository.findAllWithUsers(); // Use custom query with JOIN FETCH
        for (Task task : tasks) {
            log.info("Task {} has {} assigned employees", task.getTitle(), task.getAssignedUsers().size());
        }
        return tasks.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public TaskResponseDTO createTask(TaskRequestDTO requestDTO){
        log.info("Creating new task with title: {}", requestDTO.getTitle());

        Task task = modelMapper.map(requestDTO, Task.class);

        // Set assigned users
        if (requestDTO.getUserIds() != null && !requestDTO.getUserIds().isEmpty()) {
            Set<User> assignedUsers = new HashSet<>();
            for (Long userId : requestDTO.getUserIds()) {
                User user = userRepository.findById(userId)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
                assignedUsers.add(user);
            }
            task.setAssignedUsers(assignedUsers);
        }

        // Handle checklist items
        if (requestDTO.getChecklistItems() != null && !requestDTO.getChecklistItems().isEmpty()) {
            List<ChecklistItem> checklistItems = new ArrayList<>();
            for (ChecklistItemRequestDTO itemDTO : requestDTO.getChecklistItems()) {
                ChecklistItem item = ChecklistItem.builder()
                        .text(itemDTO.getText())
                        .completed(itemDTO.getCompleted() != null ? itemDTO.getCompleted() : false)
                        .task(task)
                        .build();
                checklistItems.add(item);
            }
            task.setChecklistItems(checklistItems);
        }

        Task savedTask = taskRepository.save(task);
        log.info("Task created successfully with id: {}", savedTask.getId());
        return convertToResponseDTO(savedTask);
    }

    public TaskResponseDTO getTaskById(Long id){
        log.info("Fetching task with id: {}", id);
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        return convertToResponseDTO(task);
    }

    public TaskResponseDTO updateTask(Long id, TaskRequestDTO requestDTO){
        log.info("Updating task with id: {}", id);

        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        modelMapper.map(requestDTO, existingTask);

        // Update assigned users
        if (requestDTO.getUserIds() != null){
            Set<User> users = new HashSet<>();
            for (Long userId : requestDTO.getUserIds()){
                User user = userRepository.findById(userId)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
                users.add(user);
            }
            existingTask.setAssignedUsers(users);
        }
        Task updatedTask = taskRepository.save(existingTask);
        log.info("Task updated successfully with id: {}", updatedTask.getId());
        return convertToResponseDTO(updatedTask);
    }

    public void deleteTask(Long id){
        log.info("Deleting task with id: {}", id);
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        taskRepository.delete(task);
        log.info("Task deleted successfully with id: {}", id);
    }

    @Transactional(readOnly = true)
    public List<TaskResponseDTO> getMyTasks(Long userId){
        log.info("Fetching tasks for user with id: {}", userId);
        List<Task> tasks = taskRepository.findTasksByUserId(userId);
        return tasks.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TaskResponseDTO getMyTaskById(Long userId, Long taskId) {
        log.info("Fetching task {} for user {}", taskId, userId);

        // First check if the task exists and the user has access to it
        Task task = taskRepository.findTaskByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId + " or access denied"));

        // Fetch the task with users
        Task taskWithUsers = taskRepository.findTaskByIdWithUsers(taskId).orElse(task);

        // Fetch the task with checklist items
        Task taskWithChecklist = taskRepository.findTaskByIdWithChecklistItems(taskId).orElse(task);

        task.setAssignedUsers(taskWithUsers.getAssignedUsers());
        task.setChecklistItems(taskWithChecklist.getChecklistItems());

        return convertToResponseDTO(task);
    }

    @Transactional
    public ChecklistItemResponseDTO updateChecklistItem(Long taskId, Long itemId, ChecklistItemRequestDTO requestDTO) {

        log.info("TaskId: {}, ItemId: {}, New Completed Status: {}", taskId, itemId, requestDTO.getCompleted());

        Task task = taskRepository.findTaskByIdWithChecklistItems(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        ChecklistItem checklistItem = task.getChecklistItems().stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format("Checklist item not found with id: %d for task: %d", itemId, taskId)
                ));

        // Update checklist item completion status
        if (requestDTO.getCompleted() != null) {
            checklistItem.setCompleted(requestDTO.getCompleted());
        }

        // Recalculate task status
        boolean allCompleted = task.getChecklistItems().stream().allMatch(ChecklistItem::getCompleted);
        boolean anyCompleted = task.getChecklistItems().stream().anyMatch(ChecklistItem::getCompleted);

        if (allCompleted) {
            task.setStatus(TaskStatus.COMPLETED);
        } else if (anyCompleted) {
            task.setStatus(TaskStatus.IN_PROGRESS);
            if (task.getStartDate() == null) {
                task.setStartDate(LocalDateTime.now());
            }
        } else {
            task.setStatus(TaskStatus.PENDING);
            task.setStartDate(null);
        }

        taskRepository.save(task);

        log.info("Updated Task ID: {}, Status: {}, StartDate: {}", task.getId(), task.getStatus(), task.getStartDate());

        return ChecklistItemResponseDTO.builder()
                .id(checklistItem.getId())
                .text(checklistItem.getText())
                .completed(checklistItem.getCompleted())
                .build();
    }

    private TaskResponseDTO convertToResponseDTO(Task task){
        TaskResponseDTO responseDTO = modelMapper.map(task, TaskResponseDTO.class);

        // Force initialization of the collection and then convert
        Set<UserSummaryDTO> userSummaries = task.getAssignedUsers().stream()
                .map(user -> UserSummaryDTO.builder()
                        .id(user.getId())
                        .fullName(user.getFullName())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .build())
                .collect(Collectors.toSet());

        responseDTO.setAssignedUsers(userSummaries);

        // Force initialization of checklist items and convert
        List<ChecklistItemResponseDTO> checklistItemDTOs = task.getChecklistItems().stream()
                .map(item -> ChecklistItemResponseDTO.builder()
                        .id(item.getId())
                        .text(item.getText())
                        .completed(item.getCompleted())
                        .build())
                .collect(Collectors.toList());

        responseDTO.setChecklistItems(checklistItemDTOs);

        return responseDTO;
    }

}
