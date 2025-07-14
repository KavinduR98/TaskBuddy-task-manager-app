package com.ushan.backend.service;

import com.ushan.backend.dto.request.TaskRequestDTO;
import com.ushan.backend.dto.response.EmployeeSummaryDTO;
import com.ushan.backend.dto.response.TaskResponseDTO;
import com.ushan.backend.entity.Employee;
import com.ushan.backend.entity.Task;
import com.ushan.backend.exception.ResourceNotFoundException;
import com.ushan.backend.repository.EmployeeRepository;
import com.ushan.backend.repository.TaskRepository;
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
    private final ModelMapper modelMapper;
    private final EmployeeRepository employeeRepository;

    public TaskService(TaskRepository taskRepository, ModelMapper modelMapper, EmployeeRepository employeeRepository) {
        this.taskRepository = taskRepository;
        this.modelMapper = modelMapper;
        this.employeeRepository = employeeRepository;
    }

    @Transactional(readOnly = true)
    public List<TaskResponseDTO> getAllTasks(){
        log.info("Fetching all tasks");
        List<Task> tasks = taskRepository.findAllWithEmployees(); // Use custom query with JOIN FETCH
        for (Task task : tasks) {
            log.info("Task {} has {} assigned employees", task.getTitle(), task.getAssignedEmployees().size());
        }
        return tasks.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public TaskResponseDTO createTask(TaskRequestDTO requestDTO){
        log.info("Creating new task with title: {}", requestDTO.getTitle());

        Task task = modelMapper.map(requestDTO, Task.class);

        // Set assigned employees
        if (requestDTO.getEmployeeIds() != null && !requestDTO.getEmployeeIds().isEmpty()) {
            Set<Employee> employees = new HashSet<>();
            for (Long employeeId : requestDTO.getEmployeeIds()) {
                Employee employee = employeeRepository.findById(employeeId)
                        .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));
                employees.add(employee);
            }
            task.setAssignedEmployees(employees);
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

        // Update assigned employees
        if (requestDTO.getEmployeeIds() != null){
            Set<Employee> employees = new HashSet<>();
            for (Long employeeId : requestDTO.getEmployeeIds()){
                Employee employee = employeeRepository.findById(employeeId)
                        .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
                employees.add(employee);
            }
            existingTask.setAssignedEmployees(employees);
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

    private TaskResponseDTO convertToResponseDTO(Task task){
        TaskResponseDTO responseDTO = modelMapper.map(task, TaskResponseDTO.class);

        // Force initialization of the collection and then convert
        Set<EmployeeSummaryDTO> employeeSummaries = task.getAssignedEmployees().stream()
                .map(employee -> EmployeeSummaryDTO.builder()
                        .id(employee.getId())
                        .name(employee.getName())
                        .email(employee.getEmail())
                        .department(employee.getDepartment())
                        .position(employee.getPosition())
                        .build())
                .collect(Collectors.toSet());

        responseDTO.setAssignedEmployees(employeeSummaries);
        return responseDTO;
    }
}
