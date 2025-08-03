package com.ushan.backend.service;

import com.ushan.backend.dto.request.TaskRequestDTO;
import com.ushan.backend.dto.response.UserSummaryDTO;
import com.ushan.backend.dto.response.TaskResponseDTO;
import com.ushan.backend.entity.Task;
import com.ushan.backend.entity.User;
import com.ushan.backend.exception.ResourceNotFoundException;
import com.ushan.backend.repository.TaskRepository;
import com.ushan.backend.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

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
    private final ModelMapper modelMapper;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository, ModelMapper modelMapper) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
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
        return responseDTO;
    }

}
