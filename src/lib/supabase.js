import { createClient } from '@supabase/supabase-js';
import { Player } from 'src/models/Player';
import { Coach } from 'src/models/Coach';
import { Parent } from 'src/models/Parent';
import { Observation } from 'src/models/Observation';
import { PDP } from 'src/models/PDP';

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
  PARENTS: 'parents',
  PDP: 'pdp',
  OBSERVATIONS: 'observations',
codex/consolidate-supabase.js-implementation
  PLAYER_GROUPS: 'player_groups',
  COACH_GROUPS: 'coach_groups',
  GROUPS: 'groups',
  PDP: 'pdp',
  ACTIVITY_LOG: 'activity_log'
};

/**
 * Generic data service for basic CRUD operations. When a ModelClass with
 * `fromJson`/`toJson` is provided, objects are mapped accordingly. Otherwise
 * plain objects are used.
 */
class DataService {
  constructor(tableName, ModelClass = null) {
    this.tableName = tableName;
    this.ModelClass = ModelClass;
    this.defaultData = { user_email: 'demo@mpbcoaching.com' };
  }

  toModel(data) {
    if (this.ModelClass && typeof this.ModelClass.fromJson === 'function') {
      return this.ModelClass.fromJson(data);
    }
    return data;
  }

  fromModel(item) {
    if (item && typeof item.toJson === 'function') {
      return item.toJson();
    }
    return item;
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

      if (orderBy) {
        query = ascending ? query.order(orderBy) : query.order(orderBy, { ascending: false });
      }

      Object.entries(filters).forEach(([column, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(column, value);
        }
      });

      const { data, error } = await query;
      if (error) throw error;
      return data.map((d) => this.toModel(d));
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
      return this.toModel(data);
    } catch (error) {
      console.error(`Error fetching ${this.tableName} by ID:`, error);
      return null;
    }
  }

  async create(item) {
    try {
      const itemData = { ...this.fromModel(item), ...this.defaultData };

      const { data, error } = await supabase
        .from(this.tableName)
        .insert(itemData)
        .select()
        .single();

      if (error) throw error;
      return this.toModel(data);
    } catch (error) {
      console.error(`Error creating ${this.tableName}:`, error);
      return null;
    }
  }

  async update(id, item) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .update(this.fromModel(item))
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return this.toModel(data);
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
      return data.map((d) => this.toModel(d));
    } catch (error) {
      console.error(`Error searching ${this.tableName}:`, error);
      return [];
    }
  }
}

/** Player service for player-specific operations */
class PlayerService extends DataService {
  constructor() {
    super(TABLES.PLAYERS, Player);
  }

  async getPlayerWithParents(playerId) {
    try {
      const player = await this.getById(playerId);
      if (!player) return null;

      const { data: playerParents, error } = await supabase
        .from(TABLES.PLAYER_PARENTS)
        .select('parent_id')
        .eq('player_id', playerId);

      if (error) throw error;

      const parentIds = playerParents.map((pp) => pp.parent_id);
      let parents = [];

      if (parentIds.length > 0) {
        const { data: parentData, error: parentsError } = await supabase
          .from(TABLES.PARENTS)
          .select('*')
          .in('id', parentIds);

        if (parentsError) throw parentsError;
        parents = parentData.map((p) => Parent.fromJson(p));
      }

      return { player, parents };
    } catch (error) {
      console.error('Error fetching player with parents:', error);
      return null;
    }
  }

  async getPlayerWithPDP(playerId) {
    try {
      const player = await this.getById(playerId);
      if (!player) return null;

      if (player.pdp_id) {
        const { data: pdpData, error } = await supabase
          .from(TABLES.PDP)
          .select('*')
          .eq('id', player.pdp_id)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        const pdp = pdpData ? PDP.fromJson(pdpData) : null;
        return { player, pdp };
      }

      return { player, pdp: null };
    } catch (error) {
      console.error('Error fetching player with PDP:', error);
      return { player: null, pdp: null };
    }
  }
}

/** Coach service for coach-specific operations */
class CoachService extends DataService {
  constructor() {
    super(TABLES.COACHES, Coach);
  }

  async getCoachWithPlayers(coachId) {
    return { coach: await this.getById(coachId), players: [] };
  }
}

/** Parent service for parent-specific operations */
class ParentService extends DataService {
  constructor() {
    super(TABLES.PARENTS, Parent);
  }

  async getParentWithChildren(parentId) {
    try {
      const parent = await this.getById(parentId);
      if (!parent) return null;

      const { data: playerParents, error } = await supabase
        .from(TABLES.PLAYER_PARENTS)
        .select('player_id')
        .eq('parent_id', parentId);

      if (error) throw error;

      const playerIds = playerParents.map((pp) => pp.player_id);
      let children = [];

      if (playerIds.length > 0) {
        const { data: playerData, error: playersError } = await supabase
          .from(TABLES.PLAYERS)
          .select('*')
          .in('id', playerIds);

        if (playersError) throw playersError;
        children = playerData.map((p) => Player.fromJson(p));
      }

      return { parent, children };
    } catch (error) {
      console.error('Error fetching parent with children:', error);
      return null;
    }
  }
}

/** Observation service for observation-specific operations */
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

/** PDP service for PDP-specific operations */
class PDPService extends DataService {
  constructor() {
    super(TABLES.PDP, PDP);
  }

  async getPDPsForPlayer(playerId) {
    return this.getAll({ filters: { player_id: playerId } });
  }

  async getActivePDPs() {
    return this.getAll({ filters: { status: 'active' } });
  }
}

/** Activity log service for logging coach actions */
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

export const playerService = new PlayerService();
export const coachService = new CoachService();
export const parentService = new ParentService();
export const observationService = new ObservationService();
export const pdpService = new PDPService();
export const activityLogService = new ActivityLogService();

export const services = {
  players: playerService,
  coaches: coachService,
  parents: parentService,
  observations: observationService,
  pdps: pdpService,
  activityLog: activityLogService
};

/**
 * VoiceService – simple wrapper around the Web Speech API.
 * Usage:
 *   const vs = new VoiceService();
 *   vs.start(({ transcript, isFinal }) => { ... });
 *   vs.stop();
 */
export class VoiceService {
  constructor() {
    const SpeechRecognition =
      typeof window !== 'undefined'
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;

    this.isSupported = !!SpeechRecognition;
    this.recognizer = this.isSupported ? new SpeechRecognition() : null;
    if (this.recognizer) {
      this.recognizer.continuous = true;
      this.recognizer.interimResults = true;
    }
  }

  start(callback) {
    if (!this.isSupported || !this.recognizer) return;
    this.recognizer.onresult = (event) => {
      const { transcript } = event.results[event.results.length - 1][0];
      const isFinal = event.results[event.results.length - 1].isFinal;
      callback({ transcript, isFinal });
    };
    this.recognizer.start();
  }

  stop() {
    if (this.recognizer) {
      this.recognizer.stop();
    }
  }
}

