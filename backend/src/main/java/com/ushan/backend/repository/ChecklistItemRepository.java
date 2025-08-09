package com.ushan.backend.repository;

import com.ushan.backend.entity.ChecklistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChecklistItemRepository extends JpaRepository<ChecklistItem, Long> {
    Optional<ChecklistItem> findByIdAndTaskId(Long itemId, Long taskId);
}
