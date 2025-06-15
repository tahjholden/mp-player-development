# MPB Coach Dashboard Component Mapping

## Overview
This document outlines the mapping between the existing dashboard components and the MPB data model.

## Stats Cards

| Title | Data Source | Icon |
|-------|------------|------|
| Total Players | Count of players table | RxPerson |
| Active Coaches | Count of coaches table where active=true | FaChalkboardTeacher |
| Active Parents | Count of parents table | FaUserFriends |
| Active PDPs | Count of pdps table where status='active' | RxGroup |

## Charts

| Component | Current Purpose | MPB Purpose |
|-----------|----------------|-------------|
| AreaChart | Revenue/Sales trends | Observations and PDPs activity over time |
| BarChart | Store/Online distribution | Players per Coach distribution |
| PieChart | Channel breakdown | Player positions distribution |
| LineChart | Growth metrics | PDP progress tracking |

## New Components

| Component Name | Purpose | Data Source |
|---------------|---------|-------------|
| RecentObservationsTable | Display recent observations | observations table |
| OpenPDPsList | Display active PDPs | pdps table |
| PlayersWithoutParentsAlert | Alert for players with no parent linked | players LEFT JOIN player_parents |

## Implementation Plan

1. Update the `dashboardService.js` to fetch real data from Supabase tables
2. Modify existing chart components to use the new data structure
3. Create new components for observations, PDPs, and alerts
4. Update the Dashboard component to include the new components
