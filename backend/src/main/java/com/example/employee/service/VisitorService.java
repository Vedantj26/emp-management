package com.example.employee.service;

import com.example.employee.dto.VisitorRequest;
import com.example.employee.model.Visitor;

import java.util.List;

public interface VisitorService {

    Visitor createVisitorInternal(VisitorRequest visitorRequest);

    Visitor createVisitorPublic(VisitorRequest visitorRequest);

    List<Visitor> getVisitorsByExhibition(Long exhibitionId);

    List<Visitor> getAllVisitors();
}
