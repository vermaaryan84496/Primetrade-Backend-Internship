package com.aryan.Role_Based.API.System.repository;
import com.aryan.Role_Based.API.System.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task,Long> {
    List<Task> findByOwnerId(Long ownerId);
}
