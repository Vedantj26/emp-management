package com.example.employee.util;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Component
public class FileStorageUtil {

    private static final String BASE_DIR = "uploads/products";

    public String saveFile(MultipartFile file) {
        try {
            Files.createDirectories(Paths.get(BASE_DIR));

            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path path = Paths.get(BASE_DIR, filename);

            Files.write(path, file.getBytes());

            return path.toString();

        } catch (Exception e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    public byte[] readFile(String path) {
        try {
            return Files.readAllBytes(Paths.get(path));
        } catch (Exception e) {
            throw new RuntimeException("Failed to read file", e);
        }
    }
}

