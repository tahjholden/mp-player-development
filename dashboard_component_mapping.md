# Dashboard Component to Supabase Table Mapping

This document maps dashboard components to Supabase tables and outlines the data integration strategy.

## Component Mapping

| Component | Supabase Tables | Data Function | Description |
|-----------|----------------|---------------|-------------|
| StatsCard | players, coaches | getDashboardStats | Display counts from players and coaches tables |
| AreaChartComponent | players | getActivityChartData | Transform player data into activity trends |
| BarChartComponent | players, groups | getGroupDistributionData | Show distribution of players across groups |
| PieChartComponent | players | getPlayerPositionsData | Display distribution of player positions |
| LineChartComponent | None (using mock data) | getObservationGrowthData | Growth data over time (mock data as observation table not found) |
| RadarChartComponent | None (using mock data) | getPerformanceMetricsData | Performance metrics (mock data as metrics table not found) |
| GaugeChart | None (using mock data) | getObservationCompletionRate | Completion rate (mock data as observations table not found) |

## Data Integration Strategy

1. **Real Data Integration:** The dashboard now uses real data from Supabase tables where available:
   - Player count from the `players` table
   - Coach count from the `coaches` table
   - Player distribution visualization based on player data

2. **Mock Data Fallbacks:** For data types not available in the current database structure, mock data is used:
   - Observations data (no table found)
   - Performance metrics (no table found)

3. **Data Transformation:** Where real data exists but doesn't match the expected format, transformation is applied:
   - Player first name first letter is used as a substitute for position data in the pie chart
   - Player count by group is used for the bar chart

4. **Future Enhancements:** As more tables become available, the dashboard can be updated to use real data for:
   - Observations tracking
   - Performance metrics
   - Attendance tracking

