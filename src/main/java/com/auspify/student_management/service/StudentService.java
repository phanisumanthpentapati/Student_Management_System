
package com.auspify.student_management.service;

import com.auspify.student_management.entity.Student;
import com.auspify.student_management.exception.StudentNotFoundException;
import com.auspify.student_management.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    // Constructor injection
    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // Create a new student
    public Student createStudent(Student student) {
        if (studentRepository.existsByEmailIgnoreCase(student.getEmail())) {
            throw new IllegalArgumentException(
                    "A student with this email already exists"
            );
        }

        return studentRepository.save(student);
    }

    // Get all students
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // Get a student by ID
    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException(id));
    }

    // Update an existing student
    public Student updateStudent(Long id, Student updatedStudent) {
        Student existingStudent = getStudentById(id);

        boolean emailChanged = !existingStudent.getEmail()
                .equalsIgnoreCase(updatedStudent.getEmail());

        if (emailChanged &&
                studentRepository.existsByEmailIgnoreCase(updatedStudent.getEmail())) {
            throw new IllegalArgumentException(
                    "A student with this email already exists"
            );
        }

        existingStudent.setName(updatedStudent.getName());
        existingStudent.setEmail(updatedStudent.getEmail());
        existingStudent.setDepartment(updatedStudent.getDepartment());
        existingStudent.setMarks(updatedStudent.getMarks());

        return studentRepository.save(existingStudent);
    }

    // Delete a student
    public void deleteStudent(Long id) {
        Student student = getStudentById(id);
        studentRepository.delete(student);
    }

    // Search students by name
    public List<Student> searchByName(String name) {
        return studentRepository.findByNameContainingIgnoreCase(name);
    }

    // Get students by department
    public List<Student> getByDepartment(String department) {
        return studentRepository.findByDepartmentIgnoreCase(department);
    }
}
