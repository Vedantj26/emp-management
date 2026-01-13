package com.example.employee.service.impl;

import com.example.employee.model.Employee;
import com.example.employee.repository.EmployeeRepository;
import com.example.employee.service.EmailService;
import com.example.employee.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    private final EmailService emailService;

    @Override
    public Employee createEmployee(Employee employee) {

        Employee savedEmployee = employeeRepository.save(employee);

        emailService.sendSelectionEmail(
                savedEmployee.getEmail(),
                savedEmployee.getName(),
                savedEmployee.getDepartment()
        );

        emailService.sendOfferLetterEmail(
                savedEmployee.getEmail(),
                savedEmployee.getName(),
                null
        );

        return savedEmployee;
    }

    @Override
    public Employee updateEmployee(Long id, Employee employee) {
        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        existingEmployee.setName(employee.getName());
        existingEmployee.setEmail(employee.getEmail());
        existingEmployee.setDepartment(employee.getDepartment());
        existingEmployee.setSalary(employee.getSalary());

        return employeeRepository.save(existingEmployee);
    }

    @Override
    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
    }

    @Override
    public List<Employee> getAllEmployees() {
        return employeeRepository.findByDeletedFalse();
    }

    @Override
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        employee.setDeleted(true);
        employeeRepository.save(employee);
    }
}
