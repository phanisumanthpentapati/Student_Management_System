
package com.auspify.student_management.repository;

import com.auspify.student_management.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Long> {

    List<Student> findByNameContainingIgnoreCase(String name);

    List<Student> findByDepartmentIgnoreCase(String department);

    boolean existsByEmailIgnoreCase(String email);
}
