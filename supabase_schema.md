# MPB Coaches Dashboard Database Schema

**Version:** 1.0  
**Created:** 2025-06-14 12:14:14  

## Overview

A relational database schema for managing players, coaches, parents, observations, and PDPs

## Tables

### Players

Stores information about players

#### Columns

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | uuid | Unique identifier | PRIMARY KEY, DEFAULT: gen_random_uuid() |
| first_name | text | Player's first name | NOT NULL |
| last_name | text | Player's last name | NOT NULL |
| age | integer | Player's age |  |
| position | text | Player's position on the team |  |
| team | text | Player's team or group assignment |  |
| last_observation_date | timestamp with time zone | Date of the last observation for this player |  |
| active_pdp_id | uuid | Reference to the player's active Player Development Plan | REFERENCES pdps.id |
| created_at | timestamp with time zone | Record creation timestamp | NOT NULL, DEFAULT: now() |
| updated_at | timestamp with time zone | Record last update timestamp | NOT NULL, DEFAULT: now() |

#### Indexes

| Columns | Type | Unique |
|---------|------|--------|
| last_name, first_name | btree | No |
| active_pdp_id | btree | No |

### Coaches

Stores information about coaches

#### Columns

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | uuid | Unique identifier | PRIMARY KEY, DEFAULT: gen_random_uuid() |
| first_name | text | Coach's first name | NOT NULL |
| last_name | text | Coach's last name | NOT NULL |
| email | text | Coach's email address | UNIQUE |
| phone | text | Coach's phone number |  |
| last_observation_submitted | timestamp with time zone | Date of the last observation submitted by this coach |  |
| active | boolean | Whether the coach is currently active | NOT NULL, DEFAULT: True |
| created_at | timestamp with time zone | Record creation timestamp | NOT NULL, DEFAULT: now() |
| updated_at | timestamp with time zone | Record last update timestamp | NOT NULL, DEFAULT: now() |

#### Indexes

| Columns | Type | Unique |
|---------|------|--------|
| last_name, first_name | btree | No |
| email | btree | Yes |

### Parents

Stores information about parents of players

#### Columns

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | uuid | Unique identifier | PRIMARY KEY, DEFAULT: gen_random_uuid() |
| first_name | text | Parent's first name | NOT NULL |
| last_name | text | Parent's last name | NOT NULL |
| email | text | Parent's email address | UNIQUE |
| phone | text | Parent's phone number |  |
| address | text | Parent's address |  |
| created_at | timestamp with time zone | Record creation timestamp | NOT NULL, DEFAULT: now() |
| updated_at | timestamp with time zone | Record last update timestamp | NOT NULL, DEFAULT: now() |

#### Indexes

| Columns | Type | Unique |
|---------|------|--------|
| last_name, first_name | btree | No |
| email | btree | Yes |

### Player_parents

Junction table linking players to their parents

#### Columns

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | uuid | Unique identifier | PRIMARY KEY, DEFAULT: gen_random_uuid() |
| player_id | uuid | Reference to the player | NOT NULL, REFERENCES players.id, ON DELETE cascade |
| parent_id | uuid | Reference to the parent | NOT NULL, REFERENCES parents.id, ON DELETE cascade |
| relationship | text | Relationship type (e.g., 'mother', 'father', 'guardian') |  |
| created_at | timestamp with time zone | Record creation timestamp | NOT NULL, DEFAULT: now() |

#### Indexes

| Columns | Type | Unique |
|---------|------|--------|
| player_id, parent_id | btree | Yes |

### Coach_players

Junction table linking coaches to their assigned players

#### Columns

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | uuid | Unique identifier | PRIMARY KEY, DEFAULT: gen_random_uuid() |
| coach_id | uuid | Reference to the coach | NOT NULL, REFERENCES coaches.id, ON DELETE cascade |
| player_id | uuid | Reference to the player | NOT NULL, REFERENCES players.id, ON DELETE cascade |
| is_primary | boolean | Whether this coach is the primary coach for the player |  |
| created_at | timestamp with time zone | Record creation timestamp | NOT NULL, DEFAULT: now() |

#### Indexes

| Columns | Type | Unique |
|---------|------|--------|
| coach_id, player_id | btree | Yes |

### Pdps

Player Development Plans to track each player's development focus and progress

#### Columns

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | uuid | Unique identifier | PRIMARY KEY, DEFAULT: gen_random_uuid() |
| player_id | uuid | Reference to the player | NOT NULL, REFERENCES players.id, ON DELETE cascade |
| development_focus | text | Main focus area for development | NOT NULL |
| status | text | Status of the PDP (active, completed, draft) | NOT NULL, DEFAULT: 'draft' |
| start_date | timestamp with time zone | Start date of the development plan | DEFAULT: now() |
| target_end_date | timestamp with time zone | Target end date for the development plan |  |
| actual_end_date | timestamp with time zone | Actual completion date |  |
| coach_id | uuid | Reference to the coach who created or is responsible for the PDP | REFERENCES coaches.id |
| last_updated_by | uuid | Reference to the coach who last updated the PDP | REFERENCES coaches.id |
| last_observation_date | timestamp with time zone | Date of the last observation linked to this PDP |  |
| created_at | timestamp with time zone | Record creation timestamp | NOT NULL, DEFAULT: now() |
| updated_at | timestamp with time zone | Record last update timestamp | NOT NULL, DEFAULT: now() |

#### Indexes

| Columns | Type | Unique |
|---------|------|--------|
| player_id | btree | No |
| status | btree | No |

### Observations

Observations made by coaches about players

#### Columns

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | uuid | Unique identifier | PRIMARY KEY, DEFAULT: gen_random_uuid() |
| player_id | uuid | Reference to the player being observed | NOT NULL, REFERENCES players.id, ON DELETE cascade |
| coach_id | uuid | Reference to the coach making the observation | NOT NULL, REFERENCES coaches.id |
| pdp_id | uuid | Reference to a PDP if this observation is related to one | REFERENCES pdps.id |
| observation_date | timestamp with time zone | Date when the observation was made | NOT NULL, DEFAULT: now() |
| type | text | Type of observation (e.g., 'practice', 'game', 'note') | NOT NULL |
| summary | text | Brief summary of the observation | NOT NULL |
| description | text | Detailed description of the observation |  |
| created_at | timestamp with time zone | Record creation timestamp | NOT NULL, DEFAULT: now() |
| updated_at | timestamp with time zone | Record last update timestamp | NOT NULL, DEFAULT: now() |

#### Indexes

| Columns | Type | Unique |
|---------|------|--------|
| player_id | btree | No |
| coach_id | btree | No |
| pdp_id | btree | No |
| observation_date | btree | No |

## Relationships

| Name | From Table | From Column | To Table | To Column | Type |
|------|------------|-------------|----------|-----------|------|
| player_to_active_pdp | players | active_pdp_id | pdps | id | one-to-one |
| player_parents | player_parents | player_id | players | id | many-to-one |
| parent_players | player_parents | parent_id | parents | id | many-to-one |
| coach_assigned_players | coach_players | coach_id | coaches | id | many-to-one |
| player_assigned_coaches | coach_players | player_id | players | id | many-to-one |
| player_pdps | pdps | player_id | players | id | many-to-one |
| pdp_coach | pdps | coach_id | coaches | id | many-to-one |
| observation_player | observations | player_id | players | id | many-to-one |
| observation_coach | observations | coach_id | coaches | id | many-to-one |
| observation_pdp | observations | pdp_id | pdps | id | many-to-one |

## Implementation Notes

- **Strict Relational Integrity**: All connections between entities are made via linked records with explicit foreign key relationships.
- **Automation Ready**: The schema is designed with UUIDs and clean relationships to support Make/n8n/GPT automation flows.
- **Dashboard Integration**: This schema supports all the required dashboard features including real-time counts, recent activity feed, and alerts for missing parent links or overdue PDPs.

## Dashboard Integration

### Real-time Counts
- Total Players (count of players table)
- Active Coaches (count of coaches table where active=true)
- Active Parents (count of parents table)
- Active PDPs (count of pdps table where status='active')

### Activity Trends
- Observations over time (count of observations grouped by month/week)
- PDPs over time (count of pdps grouped by month/week)

### Distribution Charts
- Players per Coach (from coach_players table)
- Observations by Player or Coach (from observations table)

### Alerts and Flags
- Players with no parent linked (players without entries in player_parents)
- Overdue PDPs (pdps where target_end_date < current_date and status='active')

## Sample SQL Queries

### Players Without Parents
```sql
SELECT p.* FROM players p LEFT JOIN player_parents pp ON p.id = pp.player_id WHERE pp.id IS NULL
```

### Overdue Pdps
```sql
SELECT pdp.*, p.first_name, p.last_name FROM pdps pdp JOIN players p ON pdp.player_id = p.id WHERE pdp.status = 'active' AND pdp.target_end_date < NOW()
```

### Recent Observations
```sql
SELECT o.*, p.first_name as player_first_name, p.last_name as player_last_name, c.first_name as coach_first_name, c.last_name as coach_last_name FROM observations o JOIN players p ON o.player_id = p.id JOIN coaches c ON o.coach_id = c.id ORDER BY o.observation_date DESC LIMIT 10
```

### Coach Player Count
```sql
SELECT c.id, c.first_name, c.last_name, COUNT(cp.player_id) as player_count FROM coaches c LEFT JOIN coach_players cp ON c.id = cp.coach_id GROUP BY c.id, c.first_name, c.last_name ORDER BY player_count DESC
```

