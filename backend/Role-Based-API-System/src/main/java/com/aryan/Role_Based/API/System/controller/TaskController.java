package com.aryan.Role_Based.API.System.controller;
import com.aryan.Role_Based.API.System.model.Task;
import com.aryan.Role_Based.API.System.repository.TaskRepository;
import com.aryan.Role_Based.API.System.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/v1/tasks") // API Versioning
public class TaskController {

    private final TaskRepository taskRepo;
    private final UserRepository userRepo;

    public TaskController(TaskRepository taskRepo, UserRepository userRepo) {
        this.taskRepo = taskRepo;
        this.userRepo = userRepo;
    }

    // Helper method to get the current user's ID
    private Long getUserId(Authentication auth) {
        String username = (String) auth.getPrincipal();
        return userRepo.findByUsername(username).get().getId();
    }

    // GET: Retrieve all tasks for the current user (Protected)
    @GetMapping
    public List<Task> getMyTasks(Authentication auth) {
        Long userId = getUserId(auth);
        return taskRepo.findByOwnerId(userId);
    }

    // POST: Create a new task (Protected, requires @Valid)
    @PostMapping
    public ResponseEntity<Task> createTask(@Valid @RequestBody Task t, Authentication auth) {
        Long userId = getUserId(auth);
        t.setOwnerId(userId);
        return ResponseEntity.status(201).body(taskRepo.save(t)); // Use 201 Created
    }

    // PUT: Update an existing task (Protected, Role-based access)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @Valid @RequestBody Task newTask, Authentication auth) {
        Long userId = getUserId(auth);

        return taskRepo.findById(id).map(task -> {

            boolean isAdmin = auth.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

            // Check ownership OR admin role
            if (!task.getOwnerId().equals(userId) && !isAdmin) {
                return ResponseEntity.status(403).body("Not allowed to update this task.");
            }

            task.setTitle(newTask.getTitle());
            task.setDescription(newTask.getDescription());
            task.setCompleted(newTask.isCompleted());

            return ResponseEntity.ok(taskRepo.save(task));
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE: Delete a task (Protected, Role-based access)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id, Authentication auth) {
        Long userId = getUserId(auth);

        return taskRepo.findById(id).map(task -> {

            boolean isAdmin = auth.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

            // Check ownership OR admin role
            if (!task.getOwnerId().equals(userId) && !isAdmin) {
                return ResponseEntity.status(403).body("Not allowed to delete this task.");
            }

            taskRepo.delete(task);
            return ResponseEntity.noContent().build(); // Use 204 No Content for successful deletion
        }).orElse(ResponseEntity.notFound().build());
    }
}