# MPB Coaches Dashboard Component Mapping Plan

## Current Dashboard Structure
The current dashboard has the following key components:
AreaChartComponent, BarChartComponent, PieChartComponent, LineChartComponent, RadarChartComponent, GaugeChart, BubbleChart, TreeMapChart

## Stats Cards Mapping
| Current | MPB MVP | Data Source |
|---------|---------|------------|
| Total Players | Total Players | players table |
| Active Coaches | Active Coaches | coaches table |
| Other Stats | Active Parents | parents table |
| Other Stats | Active PDPs | pdps table |

## Chart Mapping
| Current Chart | Current Purpose | MPB MVP Purpose | Data Source |
|--------------|----------------|----------------|------------|
| AreaChart | Revenue/Sales trends | Observations and PDPs activity | observations, pdps tables |
| BarChart | Store/Online distribution | Players per Coach | players, coaches, coach_players tables |
| PieChart | Channel breakdown | Player positions | players table (position field) |
| LineChart | Growth metrics | PDP progress tracking | pdps, observations tables |

## New Components Needed
1. **Recent Observations Table/List**
   - Data Source: observations table
   - Fields: Date, Player, Observer (Coach/Parent), Summary, Link to PDP

2. **Open PDPs Table/List**
   - Data Source: pdps table
   - Fields: Player, Status, Assigned Coach, Last Updated

3. **Players with No Parent Linked Warning/Alert**
   - Data Source: Query joining players and player_parents tables
   - Purpose: Flag players without parent connections

## Service Functions Required
Current functions: , , , , , 

Functions needed for MPB MVP:
- `getDashboardStats` - Get counts of players, coaches, parents, and PDPs
- `getActivityChartData` - Get observations and PDPs activity over time
- `getPlayersPerCoachData` - Get player distribution per coach
- `getPlayerPositionsData` - Get player position distribution
- `getPDPProgressData` - Get PDP progress data for tracking
- `getRecentObservations` - Get recent observations for table display
- `getOpenPDPs` - Get open PDPs for table display
- `getPlayersWithoutParents` - Find players without linked parents

## Implementation Strategy
1. Update the Dashboard.jsx to include the new MPB-specific components
2. Update dashboardService.js to implement the required data functions
3. Create new components for Recent Observations, Open PDPs, and Missing Parent alerts
4. Ensure proper error handling and loading states for all data fetching
