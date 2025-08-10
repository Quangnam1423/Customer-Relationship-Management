package com.example.crm.statistics.service;

import com.example.crm.statistics.dto.StatisticsFilterRequest;
import com.example.crm.statistics.dto.StatisticsResponse;

public interface StatisticsService {
    StatisticsResponse getLeadStatistics(StatisticsFilterRequest filter);
}
