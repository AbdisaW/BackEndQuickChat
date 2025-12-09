class RegisterDTO {
  constructor({ firstName, lastName, email, password }) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
  }

  validate() {
    if (!this.firstName || !this.lastName) throw new Error("Name is required");
    if (!this.email) throw new Error("Email is required");
    if (!this.password) throw new Error("Password is required");
    return true;
  }
}

module.exports = RegisterDTO;
