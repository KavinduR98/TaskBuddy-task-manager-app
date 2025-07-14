package com.ushan.backend.repository;

import com.ushan.backend.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    @Query("SELECT DISTINCT t FROM Task t LEFT JOIN FETCH t.assignedEmployees")
    List<Task> findAllWithEmployees();
}
