package com.example.employee.service;

import com.example.employee.model.Exhibition;

import java.util.List;

public interface ExhibitionService {

    Exhibition createExhibition(Exhibition exhibition);

    Exhibition updateExhibition(Long id, Exhibition exhibition);

    List<Exhibition> getAllExhibitions();

    void deleteExhibition(Long id);
}
