export class Coach {
  constructor({
    id = null,
    name = '',
    email = '',
    created_at = null,
    updated_at = null
  } = {}) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  static fromJson(json) {
    return new Coach(json);
  }

  toJson() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}