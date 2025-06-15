import { createClient } from '@supabase/supabase-js';
import { Player } from 'src/models/Player';
import { Coach } from 'src/models/Coach';
import { Parent } from 'src/models/Parent';
import { Observation } from 'src/models/Observation';
import { PDP } from 'src/models/PDP';

// Supabase connection configuration
const supabaseUrl = 'https://lzxohcvxsmsmabvseulj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6eG9oY3Z4c21zbWFidnNldWxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3OTc5ODIsImV4cCI6MjA2MjM3Mzk4Mn0.AXbsgPx54swWdGOEpSmJO9e16Of3TToClA-chQgh4Ag';

// Table prefixes for the current session
const tablePrefix = 'mpb_4ivic_';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey);

// Table names
export const TABLES = {
  PLAYERS: `${tablePrefix}players`,
  COACHES: `${tablePrefix}coaches`,
  PARENTS: `${tablePrefix}parents`,
  PDPS: `${tablePrefix}pdps`,
  OBSERVATIONS: `${tablePrefix}observations`,
  PLAYER_PARENTS: `${tablePrefix}player_parents`,
  COACH_PLAYERS: `${tablePrefix}coach_players`
};

/**
 * Generic data service for basic CRUD operations
 */
class DataService {
  constructor(tableName, ModelClass) {
    this.tableName = tableName;
    this.ModelClass = ModelClass;
    
    // Add user email to every created record
    this.defaultData = {
      user_email: 'demo@mpbcoaching.com' // Default user for demo purposes
    };
  }

  async getAll(options = {}) {
    try {
      const { 
        columns = '*', 
        limit = 100, 
        orderBy = 'id', 
        ascending = true,
        filters = {}
      } = options;
      
      let query = supabase
        .from(this.tableName)
        .select(columns)
        .limit(limit);
        
      // Add ordering
      if (orderBy) {
        query = ascending ? query.order(orderBy) : query.order(orderBy, { ascending: false });
      }
      
      // Add any filters
      Object.entries(filters).forEach(([column, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(column, value);
        }
      });
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data.map(item => this.ModelClass.fromJson(item));
    } catch (error) {
      console.error(`Error fetching data from ${this.tableName}:`, error);
      return [];
    }
  }

  async getById(id) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return this.ModelClass.fromJson(data);
    } catch (error) {
      console.error(`Error fetching ${this.tableName} by ID:`, error);
      return null;
    }
  }

  async create(item) {
    try {
      // Add user_email to the item being created
      const itemData = {
        ...item.toJson(),
        ...this.defaultData
      };
      
      const { data, error } = await supabase
        .from(this.tableName)
        .insert(itemData)
        .select()
        .single();
      
      if (error) throw error;
      return this.ModelClass.fromJson(data);
    } catch (error) {
      console.error(`Error creating ${this.tableName}:`, error);
      return null;
    }
  }

  async update(id, item) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .update(item.toJson())
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return this.ModelClass.fromJson(data);
    } catch (error) {
      console.error(`Error updating ${this.tableName}:`, error);
      return null;
    }
  }

  async delete(id) {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error deleting ${this.tableName}:`, error);
      return false;
    }
  }

  async search(column, value) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .ilike(column, `%${value}%`)
        .limit(100);
      
      if (error) throw error;
      return data.map(item => this.ModelClass.fromJson(item));
    } catch (error) {
      console.error(`Error searching ${this.tableName}:`, error);
      return [];
    }
  }
}

/**
 * Player service for player-specific operations
 */
class PlayerService extends DataService {
  constructor() {
    super(TABLES.PLAYERS, Player);
  }

  async getPlayerWithParents(playerId) {
    try {
      // First get the player
      const player = await this.getById(playerId);
      if (!player) return null;
      
      // Then get related parents
      const { data: playerParents, error } = await supabase
        .from(TABLES.PLAYER_PARENTS)
        .select('parent_id')
        .eq('player_id', playerId);
      
      if (error) throw error;
      
      // Get parent details for each parent_id
      const parentIds = playerParents.map(pp => pp.parent_id);
      let parents = [];
      
      if (parentIds.length > 0) {
        const { data: parentData, error: parentsError } = await supabase
          .from(TABLES.PARENTS)
          .select('*')
          .in('id', parentIds);
        
        if (parentsError) throw parentsError;
        parents = parentData.map(p => Parent.fromJson(p));
      }
      
      return { player, parents };
    } catch (error) {
      console.error('Error fetching player with parents:', error);
      return null;
    }
  }

  async getPlayerWithPDP(playerId) {
    try {
      // Get the player
      const player = await this.getById(playerId);
      if (!player) return null;
      
      // Get PDP for the player if it exists
      if (player.pdp_id) {
        const { data: pdpData, error } = await supabase
          .from(TABLES.PDPS)
          .select('*')
          .eq('id', player.pdp_id)
          .single();
        
        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
        
        const pdp = pdpData ? PDP.fromJson(pdpData) : null;
        return { player, pdp };
      }
      
      return { player, pdp: null };
    } catch (error) {
      console.error('Error fetching player with PDP:', error);
      return { player: null, pdp: null };
    }
  }

  // Additional player-specific methods can be added here
}

/**
 * Coach service for coach-specific operations
 */
class CoachService extends DataService {
  constructor() {
    super(TABLES.COACHES, Coach);
  }

  async getCoachWithPlayers(coachId) {
    // This would require a coach_players table that doesn't currently exist
    // For now, we'll just return the coach
    return { coach: await this.getById(coachId), players: [] };
  }

  // Additional coach-specific methods can be added here
}

/**
 * Parent service for parent-specific operations
 */
class ParentService extends DataService {
  constructor() {
    super(TABLES.PARENTS, Parent);
  }

  async getParentWithChildren(parentId) {
    try {
      // Get the parent
      const parent = await this.getById(parentId);
      if (!parent) return null;
      
      // Get related players
      const { data: playerParents, error } = await supabase
        .from(TABLES.PLAYER_PARENTS)
        .select('player_id')
        .eq('parent_id', parentId);
      
      if (error) throw error;
      
      // Get player details for each player_id
      const playerIds = playerParents.map(pp => pp.player_id);
      let children = [];
      
      if (playerIds.length > 0) {
        const { data: playerData, error: playersError } = await supabase
          .from(TABLES.PLAYERS)
          .select('*')
          .in('id', playerIds);
        
        if (playersError) throw playersError;
        children = playerData.map(p => Player.fromJson(p));
      }
      
      return { parent, children };
    } catch (error) {
      console.error('Error fetching parent with children:', error);
      return null;
    }
  }

  // Additional parent-specific methods can be added here
}

/**
 * Observation service for observation-specific operations
 */
class ObservationService extends DataService {
  constructor() {
    super(TABLES.OBSERVATIONS, Observation);
  }

  async getObservationsForPlayer(playerId) {
    return this.getAll({ filters: { player_id: playerId } });
  }

  async getObservationsForPDP(pdpId) {
    return this.getAll({ filters: { pdp_id: pdpId } });
  }

  async getObservationsByCoach(coachId) {
    return this.getAll({ filters: { coach_id: coachId } });
  }
}

/**
 * PDP service for PDP-specific operations
 */
class PDPService extends DataService {
  constructor() {
    super(TABLES.PDPS, PDP);
  }

  async getPDPsForPlayer(playerId) {
    return this.getAll({ filters: { player_id: playerId } });
  }

  async getActivePDPs() {
    return this.getAll({ filters: { status: 'active' } });
  }
}

// Initialize all services
export const playerService = new PlayerService();
export const coachService = new CoachService();
export const parentService = new ParentService();
export const observationService = new ObservationService();
export const pdpService = new PDPService();

// Export all services as a single object
export const services = {
  players: playerService,
  coaches: coachService,
  parents: parentService,
  observations: observationService,
  pdps: pdpService
};

// Note: Dashboard service is now imported from dashboardService.js
