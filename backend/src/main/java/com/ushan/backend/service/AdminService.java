package com.ushan.backend.service;

import com.ushan.backend.dto.response.UserSummaryDTO;
import com.ushan.backend.entity.User;
import com.ushan.backend.repository.UserRepository;
import com.ushan.backend.util.Role;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@Transactional(readOnly = true)
public class AdminService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    public AdminService(UserRepository userRepository, ModelMapper modelMapper) {
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
    }

    public List<UserSummaryDTO> getAllTeamMembers(){
        log.info("Fetching all team members");
        List<User> teamMembers = userRepository.findByRole(Role.MEMBER);
        return teamMembers.stream()
                .map(user -> modelMapper.map(user, UserSummaryDTO.class))
                .collect(Collectors.toList());
    }
}
