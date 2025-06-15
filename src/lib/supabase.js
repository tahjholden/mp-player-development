import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client if environment variables are missing
const createMockClient = () => ({
  from: () => ({
    select: () => ({
      count: 'exact',
      head: true,
      then: (callback) => callback({ count: 0 })
    })
  })
});

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();

export const TABLES = {
  PLAYERS: 'players',
  COACHES: 'coaches',
  OBSERVATIONS: 'observations',
  PDP: 'pdp',
  GROUPS: 'groups',
  PARENTS: 'parents',
  PLAYER_PARENTS: 'player_parents',
  PLAYER_GROUPS: 'player_groups',
  COACH_GROUPS: 'coach_groups',
  ACTIVITY_LOG: 'activity_log'
};

class DataService {
  constructor(tableName) {
    this.tableName = tableName;
  }

  async getAll() {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*');
    if (error) throw error;
    return data;
  }

  async getById(id) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  async create(item) {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(item)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async update(id, item) {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(item)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async delete(id) {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
}

class PDPService extends DataService {
  constructor() {
    super(TABLES.PDP);
  }

  async getPDPsForPlayer(playerId) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('player_id', playerId);
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching PDPs for player:', error);
      return [];
    }
  }

  async getActivePDPs() {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('active', true);
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching active PDPs:', error);
      return [];
    }
  }
}

class PlayerGroupService extends DataService {
  constructor() {
    super(TABLES.PLAYER_GROUPS);
  }

  async getGroupsForPlayer(playerId) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*, groups(*)')
        .eq('player_id', playerId);
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching player groups:', error);
      return [];
    }
  }
}

class CoachGroupService extends DataService {
  constructor() {
    super(TABLES.COACH_GROUPS);
  }

  async getGroupsForCoach(coachId) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*, groups(*)')
        .eq('coach_id', coachId);
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching coach groups:', error);
      return [];
    }
  }
}

class ActivityLogService extends DataService {
  constructor() {
    super(TABLES.ACTIVITY_LOG);
  }

  async getLogsForCoach(coachId) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('coach_id', coachId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      return [];
    }
  }
}

export const pdpService = new PDPService();
export const playerGroupService = new PlayerGroupService();
export const coachGroupService = new CoachGroupService();
export const activityLogService = new ActivityLogService();

export const services = {
  players: new DataService(TABLES.PLAYERS),
  coaches: new DataService(TABLES.COACHES),
  observations: new DataService(TABLES.OBSERVATIONS),
  pdps: pdpService,
  groups: new DataService(TABLES.GROUPS),
  parents: new DataService(TABLES.PARENTS),
  playerParents: new DataService(TABLES.PLAYER_PARENTS),
  playerGroups: playerGroupService,
  coachGroups: coachGroupService,
  activityLog: activityLogService
}; 