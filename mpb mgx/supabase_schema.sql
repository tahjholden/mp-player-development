-- MPB Coaches Dashboard Database Schema
-- Version: 1.0
-- Generated: 2025-06-14 12:14:14

-- Create players table
CREATE TABLE players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  age integer,
  position text,
  team text,
  last_observation_date timestamp with time zone,
  active_pdp_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  FOREIGN KEY (active_pdp_id) REFERENCES pdps(id)
);

-- Create index on players (last_name, first_name)
CREATE INDEX idx_players_0 ON players (last_name, first_name);

-- Create index on players (active_pdp_id)
CREATE INDEX idx_players_1 ON players (active_pdp_id);

-- Create coaches table
CREATE TABLE coaches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text UNIQUE,
  phone text,
  last_observation_submitted timestamp with time zone,
  active boolean NOT NULL DEFAULT True,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create index on coaches (last_name, first_name)
CREATE INDEX idx_coaches_0 ON coaches (last_name, first_name);

-- Create index on coaches (email)
CREATE UNIQUE INDEX idx_coaches_1 ON coaches (email);

-- Create parents table
CREATE TABLE parents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text UNIQUE,
  phone text,
  address text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create index on parents (last_name, first_name)
CREATE INDEX idx_parents_0 ON parents (last_name, first_name);

-- Create index on parents (email)
CREATE UNIQUE INDEX idx_parents_1 ON parents (email);

-- Create player_parents table
CREATE TABLE player_parents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid NOT NULL,
  parent_id uuid NOT NULL,
  relationship text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE cascade,
  FOREIGN KEY (parent_id) REFERENCES parents(id) ON DELETE cascade
);

-- Create index on player_parents (player_id, parent_id)
CREATE UNIQUE INDEX idx_player_parents_0 ON player_parents (player_id, parent_id);

-- Create coach_players table
CREATE TABLE coach_players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id uuid NOT NULL,
  player_id uuid NOT NULL,
  is_primary boolean,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  FOREIGN KEY (coach_id) REFERENCES coaches(id) ON DELETE cascade,
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE cascade
);

-- Create index on coach_players (coach_id, player_id)
CREATE UNIQUE INDEX idx_coach_players_0 ON coach_players (coach_id, player_id);

-- Create pdps table
CREATE TABLE pdps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid NOT NULL,
  development_focus text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  start_date timestamp with time zone DEFAULT now(),
  target_end_date timestamp with time zone,
  actual_end_date timestamp with time zone,
  coach_id uuid,
  last_updated_by uuid,
  last_observation_date timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE cascade,
  FOREIGN KEY (coach_id) REFERENCES coaches(id),
  FOREIGN KEY (last_updated_by) REFERENCES coaches(id)
);

-- Create index on pdps (player_id)
CREATE INDEX idx_pdps_0 ON pdps (player_id);

-- Create index on pdps (status)
CREATE INDEX idx_pdps_1 ON pdps (status);

-- Create observations table
CREATE TABLE observations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid NOT NULL,
  coach_id uuid NOT NULL,
  pdp_id uuid,
  observation_date timestamp with time zone NOT NULL DEFAULT now(),
  type text NOT NULL,
  summary text NOT NULL,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE cascade,
  FOREIGN KEY (coach_id) REFERENCES coaches(id),
  FOREIGN KEY (pdp_id) REFERENCES pdps(id)
);

-- Create index on observations (player_id)
CREATE INDEX idx_observations_0 ON observations (player_id);

-- Create index on observations (coach_id)
CREATE INDEX idx_observations_1 ON observations (coach_id);

-- Create index on observations (pdp_id)
CREATE INDEX idx_observations_2 ON observations (pdp_id);

-- Create index on observations (observation_date)
CREATE INDEX idx_observations_3 ON observations (observation_date);

