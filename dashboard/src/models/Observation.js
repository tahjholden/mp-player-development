export class Observation {
  constructor({
    id = null,
    player_id = null,
    observer_id = null,
    observer_type = 'coach', // 'coach' or 'parent'
    pdp_id = null,
    date = null,
    type = 'note', // 'practice', 'game', 'note'
    summary = '',
    created_at = null,
    updated_at = null
  } = {}) {
    this.id = id;
    this.player_id = player_id;
    this.observer_id = observer_id;
    this.observer_type = observer_type;
    this.pdp_id = pdp_id;
    this.date = date;
    this.type = type;
    this.summary = summary;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  static fromJson(json) {
    return new Observation(json);
  }

  toJson() {
    return {
      id: this.id,
      player_id: this.player_id,
      observer_id: this.observer_id,
      observer_type: this.observer_type,
      pdp_id: this.pdp_id,
      date: this.date,
      type: this.type,
      summary: this.summary,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}