package com.ushan.backend.controller;

import com.ushan.backend.dto.response.UserSummaryDTO;
import com.ushan.backend.service.AdminService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Slf4j
@Validated
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService){
        this.adminService = adminService;
    }

    @GetMapping("/team-members")
    public ResponseEntity<List<UserSummaryDTO>> getAllTeamMembers(){
        log.info("GET /api/admin/team-members - Fetching all team members");
        List<UserSummaryDTO> teamMembers = adminService.getAllTeamMembers();
        return ResponseEntity.ok(teamMembers);
    }
}
