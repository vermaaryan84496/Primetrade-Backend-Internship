package com.aryan.Role_Based.API.System.controller;
import com.aryan.Role_Based.API.System.dto.AuthRequest;
import com.aryan.Role_Based.API.System.dto.AuthResponse;
import com.aryan.Role_Based.API.System.model.User;
import com.aryan.Role_Based.API.System.repository.UserRepository;
import com.aryan.Role_Based.API.System.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UserRepository userRepo;
    private final BCryptPasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepo, BCryptPasswordEncoder encoder, JwtUtil jwtUtil) {
        this.userRepo = userRepo;
        this.encoder = encoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest req) {
        if (userRepo.existsByUsername(req.getUsername())) {
            return ResponseEntity.badRequest().body("Username already taken");
        }
        User u = new User();
        u.setUsername(req.getUsername());
        u.setPassword(encoder.encode(req.getPassword()));
        // default role USER
        u.setRoles(Set.of("ROLE_USER"));
        userRepo.save(u);
        return ResponseEntity.ok("User registered");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest req) {
        return userRepo.findByUsername(req.getUsername())
                .map(user -> {
                    if (!encoder.matches(req.getPassword(), user.getPassword())) {
                        return ResponseEntity.status(401).body("Invalid credentials");
                    }
                    String token = jwtUtil.generateToken(user.getUsername(), user.getRoles());
                    return ResponseEntity.ok(new AuthResponse(token));
                }).orElse(ResponseEntity.status(401).body("Invalid credentials"));
    }
}
