export class Player {
  constructor({
    id = null,
    name = '',
    date_of_birth = null,
    status = 'active',
    assigned_coach_id = null,
    active_pdp_id = null,
    created_at = null,
    updated_at = null
  } = {}) {
    this.id = id;
    this.name = name;
    this.date_of_birth = date_of_birth;
    this.status = status;
    this.assigned_coach_id = assigned_coach_id;
    this.active_pdp_id = active_pdp_id;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  static fromJson(json) {
    return new Player(json);
  }

  toJson() {
    return {
      id: this.id,
      name: this.name,
      date_of_birth: this.date_of_birth,
      status: this.status,
      assigned_coach_id: this.assigned_coach_id,
      active_pdp_id: this.active_pdp_id,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}
