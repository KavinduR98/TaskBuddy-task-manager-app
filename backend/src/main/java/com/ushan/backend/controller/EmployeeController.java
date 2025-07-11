package com.ushan.backend.controller;

import com.ushan.backend.dto.request.EmployeeRequestDTO;
import com.ushan.backend.dto.response.EmployeeResponseDTO;
import com.ushan.backend.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@Slf4j
@Validated
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public ResponseEntity<List<EmployeeResponseDTO>> getAllEmployees(){
        log.info("GET /api/employees - fetching all employees");
        List<EmployeeResponseDTO> employees = employeeService.getAllEmployees();
        log.debug("Returning {} employees", employees.size());
        return ResponseEntity.ok(employees);
    }

    @PostMapping
    public ResponseEntity<EmployeeResponseDTO> createEmployee(
            @Valid
            @RequestBody EmployeeRequestDTO requestDTO
            ){
        log.info("Post /api/employees - Creating new employee with email: {}", requestDTO.getEmail());
        EmployeeResponseDTO createdEmployee = employeeService.createEmployee(requestDTO);
        log.info("Employee created successfully with id: {}", createdEmployee.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEmployee);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponseDTO> getEmployeeById(@PathVariable Long id){
        log.info("GET /api/employee/{} - fetching employee", id);
        EmployeeResponseDTO employee = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(employee);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeResponseDTO> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeRequestDTO requestDTO
    ){
        log.info("PUT /api/employee/{} - Updating employee", id);
        EmployeeResponseDTO updatedEmployee = employeeService.updateEmployee(id, requestDTO);
        log.info("Employee updated successfully with id: {}", updatedEmployee.getId());
        return ResponseEntity.ok(updatedEmployee);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id){
        log.info("DELETE /api/employee/{} - Delete employee", id);
        employeeService.deleteEmployee(id);
        log.info("Employee deleted successfully with id: {}", id);
        return ResponseEntity.noContent().build();
    }

}
