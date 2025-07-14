package com.ushan.backend.config;

import com.ushan.backend.dto.response.TaskResponseDTO;
import com.ushan.backend.entity.Task;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration()
                .setMatchingStrategy(MatchingStrategies.STRICT)
                .setFieldMatchingEnabled(true)
                .setFieldAccessLevel(org.modelmapper.config.Configuration.AccessLevel.PRIVATE);

        // Skip the assignedEmployees field to avoid Hibernate lazy loading issues
        mapper.typeMap(Task.class, TaskResponseDTO.class)
                .addMappings(mapping -> mapping.skip(TaskResponseDTO::setAssignedEmployees));

        return mapper;
    }
}
