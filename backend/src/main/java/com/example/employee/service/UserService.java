package com.example.employee.service;

import com.example.employee.model.User;

import java.util.List;

public interface UserService {
    User createUser(User user);

    User updateUser(Long id, User user);

    User getUserById(Long id);

    List<User> getAllUsers();

    void deleteUser(Long id);
}
