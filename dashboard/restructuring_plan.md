# MPB Coaches Dashboard Restructuring Plan

## Current Structure Analysis

The current dashboard is designed as a generic analytics dashboard with components for visualizing various metrics. 
It needs to be restructured to focus on the sports team management requirements specified in the MPB MVP.

### Current Components

1. **Navigation (Sidebar.jsx)**
   - Dashboard Home
   - Analytics
   - Reports
   - Settings
   - Other generic menu items

2. **Dashboard Components (Dashboard.jsx)**
   - StatsCards (Generic metrics)
   - AreaChart (Revenue/Sales trends)
   - BarChart (Group distribution)
   - PieChart (Channel breakdown)
   - LineChart, RadarChart, GaugeChart (Various metrics)

3. **Data Structure (supabase.js)**
   - Currently configured to work with players and coaches tables
   - Missing connection to parents, observations, and PDPs

## Required Restructuring

### 1. Navigation Updates

**Current Sidebar:**
- Dashboard
- Analytics
- Reports
- Settings
- Other generic items

**Updated Sidebar:**
- Dashboard (Overview)
- Players
- Coaches 
- Parents
- Observations
- PDPs (Player Development Plans)
- Settings

### 2. Dashboard Overview Updates

**Current Stats Cards:**
- Total Players
- Active Coaches 
- Observations (mock)
- Groups (mock)

**Updated Stats Cards:**
- Total Players (from players table)
- Active Coaches (from coaches table)
- Active Parents (from parents table)
- Active PDPs (from PDPs table)

### 3. Chart Updates

| Current Chart | Current Purpose | Updated Purpose |
|---------------|----------------|----------------|
| AreaChart     | Revenue/Sales trends | Observations and PDPs activity over time |
| BarChart      | Store/Online distribution | Players per Coach distribution |
| PieChart      | Channel breakdown | Player positions distribution |
| LineChart     | Growth metrics | PDP progress tracking |

### 4. Data Integration

1. **Players Module**
   - List view with search/filter
   - Detail view with player info
   - Link to associated parents and PDPs

2. **Coaches Module**
   - List view with coach information
   - Detail view for coach profile
   - Players assigned to coach

3. **Parents Module**
   - List view with parent information
   - Detail view for parent profile
   - Link to associated players

4. **Observations Module**
   - List view showing recent observations
   - Detail view for creating/editing observations
   - Filter by player, coach, date

5. **PDPs Module**
   - List view showing player development plans
   - Detail view for creating/editing PDPs
   - Link to related observations

## Implementation Plan

### Phase 1: Core Structure
1. Update Sidebar.jsx with new navigation items
2. Update App.jsx with new routes
3. Create data models for all entities
4. Update dashboard service

### Phase 2: Dashboard Overview
1. Update stats cards with real data
2. Reconfigure charts to show relevant metrics
3. Add recent activities section
4. Add alerts for players with no parent linked

### Phase 3: Entity Management
1. Complete Player components
2. Create Coach components
3. Create Parent components
4. Create Observation components
5. Create PDP components
