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
  PDP: 'pdp',                 // personal-development-plan
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

class PlayerService extends DataService {
  constructor() {
    super(TABLES.PLAYERS);
  }

  // Future methods for fetching related data can be added here

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
        const pdp = pdpData || null;
        return { player, pdp };
      }

      return { player, pdp: null };
    } catch (error) {
      console.error('Error fetching player with PDP:', error);
      return { player: null, pdp: null };
    }
  }
}

class CoachService extends DataService {
  constructor() {
    super(TABLES.COACHES);
  }

  async getCoachWithPlayers(coachId) {
    return { coach: await this.getById(coachId), players: [] };
  }
}

class ObservationService extends DataService {
  constructor() {
    super(TABLES.OBSERVATIONS);
  }

  async getObservationsForPlayer(playerId) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('player_id', playerId);
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching observations for player:', error);
      return [];
    }
  }

  async getObservationsForPDP(pdpId) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('pdp_id', pdpId);
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching observations for PDP:', error);
      return [];
    }
  }

  async getObservationsByCoach(coachId) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('coach_id', coachId);
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching observations by coach:', error);
      return [];
    }
  }
}

export const playerService = new PlayerService();
export const coachService = new CoachService();
export const observationService = new ObservationService();
export const pdpService = new PDPService();
export const activityLogService = new ActivityLogService();

export const services = {
  players: playerService,
  coaches: coachService,
  observations: observationService,
  pdps: pdpService,
  activityLog: activityLogService
};

/**
 * VoiceService – simple wrapper around the Web Speech API (speechRecognition)
 * Usage:
 *   const vs = new VoiceService();
 *   vs.start(({ transcript, isFinal }) => { ... });
 *   vs.stop();
 */
export class VoiceService {
  constructor() {
    // eslint-disable-next-line no-undef
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
