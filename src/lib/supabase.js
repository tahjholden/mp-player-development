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
  PDP: 'pdps',                 // personal-development-plan table
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

export const pdpService = new PDPService();
export const activityLogService = new ActivityLogService();

export const services = {
  players: new DataService(TABLES.PLAYERS),
  coaches: new DataService(TABLES.COACHES),
  observations: new DataService(TABLES.OBSERVATIONS),
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
