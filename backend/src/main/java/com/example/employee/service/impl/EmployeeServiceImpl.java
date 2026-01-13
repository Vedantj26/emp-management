package com.example.employee.service.impl;

import com.example.employee.model.Employee;
import com.example.employee.repository.EmployeeRepository;
import com.example.employee.service.EmailService;
import com.example.employee.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.core.io.ByteArrayResource;

import java.io.InputStream;


import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    private final EmailService emailService;

    @Override
    public Employee createEmployee(Employee employee) {

        Employee savedEmployee = employeeRepository.save(employee);

        // 1️⃣ Send selection email
        emailService.sendSelectionEmail(
                savedEmployee.getEmail(),
                savedEmployee.getName(),
                savedEmployee.getDepartment()
        );

        // 2️⃣ Load offer letter PDF from backend
        ByteArrayResource offerLetter = loadOfferLetterFromResources();

        // 3️⃣ Send offer letter email with attachment
        emailService.sendOfferLetterEmail(
                savedEmployee.getEmail(),
                savedEmployee.getName(),
                offerLetter
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

    private ByteArrayResource loadOfferLetterFromResources() {
        try {
            InputStream is = getClass()
                    .getClassLoader()
                    .getResourceAsStream("documents/offer_letter.pdf");

            if (is == null) {
                throw new RuntimeException("Offer letter PDF not found");
            }

            return new ByteArrayResource(is.readAllBytes());

        } catch (Exception e) {
            throw new RuntimeException("Failed to load offer letter", e);
        }
    }

}
