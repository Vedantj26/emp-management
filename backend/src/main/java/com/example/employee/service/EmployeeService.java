package com.example.employee.service;

import com.example.employee.model.Employee;

import java.util.List;

public interface EmployeeService {
    Employee createEmployee(Employee employee);

    Employee updateEmployee(Long id, Employee employee);

    Employee getEmployeeById(Long id);

    List<Employee> getAllEmployees();

    void deleteEmployee(Long id);
}
