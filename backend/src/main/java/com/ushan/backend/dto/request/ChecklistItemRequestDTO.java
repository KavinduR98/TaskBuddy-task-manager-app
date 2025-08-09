package com.ushan.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChecklistItemRequestDTO {

    public interface CreateValidation {}
    public interface UpdateValidation {}

    @NotBlank(message = "Checklist item text is required", groups = CreateValidation.class)
    @Size(max = 500, message = "Checklist item text must not exceed 500 characters")
    private String text;

    private Boolean completed;
}
