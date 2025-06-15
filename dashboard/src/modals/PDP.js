export class PDP {
  constructor({
    id = null,
    player_id = null,
    coach_id = null,
    start_date = null,
    status = 'active', // 'active', 'completed', 'archived'
    focus_areas = [],
    summary = '',
    created_at = null,
    updated_at = null
  } = {}) {
    this.id = id;
    this.player_id = player_id;
    this.coach_id = coach_id;
    this.start_date = start_date;
    this.status = status;
    this.focus_areas = focus_areas;
    this.summary = summary;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  static fromJson(json) {
    // Handle focus_areas which might be a string or an array
    const focusAreas = json.focus_areas || [];
    const parsedFocusAreas = typeof focusAreas === 'string' 
      ? JSON.parse(focusAreas) 
      : focusAreas;

    return new PDP({
      ...json,
      focus_areas: parsedFocusAreas
    });
  }

  toJson() {
    return {
      id: this.id,
      player_id: this.player_id,
      coach_id: this.coach_id,
      start_date: this.start_date,
      status: this.status,
      focus_areas: this.focus_areas,
      summary: this.summary,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}