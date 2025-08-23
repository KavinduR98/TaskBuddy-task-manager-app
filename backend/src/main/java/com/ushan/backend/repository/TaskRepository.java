package com.ushan.backend.repository;

import com.ushan.backend.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    @Query("SELECT DISTINCT t FROM Task t LEFT JOIN FETCH t.assignedUsers ORDER BY t.createdAt DESC")
    List<Task> findAllWithUsers();

    @Query("SELECT DISTINCT t FROM Task t " +
            "LEFT JOIN FETCH t.assignedUsers " +
            "WHERE :userId IN (SELECT u.id FROM t.assignedUsers u)" +
            "ORDER BY t.createdAt DESC")
    List<Task> findTasksByUserId(@Param("userId") Long userId);

    // Check if user has access to task (without fetching collections)
    @Query("SELECT t FROM Task t " +
            "WHERE t.id = :taskId AND :userId IN (SELECT u.id FROM t.assignedUsers u)")
    Optional<Task> findTaskByIdAndUserId(@Param("taskId") Long taskId, @Param("userId") Long userId);

    // Fetch task with assigned users
    @Query("SELECT DISTINCT t FROM Task t " +
            "LEFT JOIN FETCH t.assignedUsers " +
            "WHERE t.id = :taskId")
    Optional<Task> findTaskByIdWithUsers(@Param("taskId") Long taskId);

    // Fetch task with checklist items
    @Query("SELECT DISTINCT t FROM Task t " +
            "LEFT JOIN FETCH t.checklistItems " +
            "WHERE t.id = :taskId")
    Optional<Task> findTaskByIdWithChecklistItems(@Param("taskId") Long taskId);
}
