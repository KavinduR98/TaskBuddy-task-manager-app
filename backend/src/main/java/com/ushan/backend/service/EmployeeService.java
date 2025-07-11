package com.ushan.backend.service;

import com.ushan.backend.dto.request.EmployeeRequestDTO;
import com.ushan.backend.dto.response.EmployeeResponseDTO;
import com.ushan.backend.entity.Employee;
import com.ushan.backend.exception.ResourceNotFoundException;
import com.ushan.backend.exception.ValidationException;
import com.ushan.backend.repository.EmployeeRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@Transactional
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final ModelMapper modelMapper;

    public EmployeeService(EmployeeRepository employeeRepository, ModelMapper modelMapper) {
        this.employeeRepository = employeeRepository;
        this.modelMapper = modelMapper;
    }

    public List<EmployeeResponseDTO> getAllEmployees(){
        log.info("Fetching all employees");
        List<Employee> employees = employeeRepository.findAll();
        log.info("Found {} employees", employees.size());
        return employees.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    private EmployeeResponseDTO convertToResponseDTO(Employee employee) {
        // Use ModelMapper to map the Employee entity to EmployeeResponseDTO
        return modelMapper.map(employee, EmployeeResponseDTO.class);
    }

    public EmployeeResponseDTO createEmployee(EmployeeRequestDTO requestDTO){
        log.info("Creating new employee with email: {}", requestDTO.getEmail());

        if(employeeRepository.existsByEmail(requestDTO.getEmail())){
            log.error("Employee already exists with email: {}", requestDTO.getEmail());
            throw new ValidationException("Employee already exists with email: " + requestDTO.getEmail());
        }

        Employee employee = modelMapper.map(requestDTO, Employee.class);
        Employee savedEmployee = employeeRepository.save(employee);

        log.info("Employee created successfully with id: {} and name: {}",
                savedEmployee.getId(), savedEmployee.getName());
        return convertToResponseDTO(savedEmployee);
    }

    public EmployeeResponseDTO getEmployeeById(Long id){
        log.info("Fetching employee with id: {}", id);
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Employee not found with id: {}", id);
                    return new ResourceNotFoundException("Employee not found with id: " + id);
                });
        log.debug("Found employee: {}", employee.getName());
        return convertToResponseDTO(employee);
    }

    public EmployeeResponseDTO updateEmployee(Long id, EmployeeRequestDTO requestDTO){
        log.info("Updating employee with id: {}", id);

        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Employee not found with id: {}", id);
                    return new ResourceNotFoundException("Employee not found with id: " + id);
                });
        if (!existingEmployee.getEmail().equals(requestDTO.getEmail()) &&
                employeeRepository.existsByEmail(requestDTO.getEmail())){
            log.error("Email already exists: {}", requestDTO.getEmail());
            throw new ValidationException("Email already exists: " + requestDTO.getEmail());
        }

        String oldName = existingEmployee.getName();
        Employee updatedEmployee = employeeRepository.save(existingEmployee);

        log.info("Employee updated successfully - ID: {}, Old name: {}, New name: {}", id, oldName, updatedEmployee.getName());
        return convertToResponseDTO(updatedEmployee);
    }

    public void deleteEmployee(Long id){
        log.info("Deleting employee with id: {}", id);
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Employee not found with id: {}", id);
                    return new ResourceNotFoundException("Employee not found with id: " + id);
                });
        String employeeName = employee.getName();
        employeeRepository.delete(employee);
        log.info("Employee deleted successfully - ID: {}, Name: {}", id, employeeName);
    }
}
