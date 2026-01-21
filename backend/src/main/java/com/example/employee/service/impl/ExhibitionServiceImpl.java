package com.example.employee.service.impl;

import com.example.employee.model.Exhibition;
import com.example.employee.repository.ExhibitionRepository;
import com.example.employee.service.ExhibitionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExhibitionServiceImpl implements ExhibitionService {

    private final ExhibitionRepository exhibitionRepository;

    @Override
    public Exhibition createExhibition(Exhibition exhibition) {
        exhibition.setId(null);
        exhibition.setDeleted(false);
        return exhibitionRepository.save(exhibition);
    }

    @Override
    public Exhibition updateExhibition(Long id, Exhibition exhibition) {
        Exhibition existing = exhibitionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exhibition not found"));

        existing.setName(exhibition.getName());
        existing.setLocation(exhibition.getLocation());
        existing.setStartDate(exhibition.getStartDate());
        existing.setEndDate(exhibition.getEndDate());
        existing.setTiming(exhibition.getTiming());
        existing.setActive(exhibition.getActive());

        return exhibitionRepository.save(existing);
    }

    @Override
    public List<Exhibition> getAllExhibitions() {
        return exhibitionRepository.findByDeletedFalse();
    }

    @Override
    public List<Exhibition> getActiveExhibitions() {
        return exhibitionRepository.findByDeletedFalseAndActiveTrue();
    }

    @Override
    public void deleteExhibition(Long id) {
        Exhibition exhibition = exhibitionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exhibition not found"));

        exhibition.setDeleted(true);
        exhibitionRepository.save(exhibition);
    }
}
