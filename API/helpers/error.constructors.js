exports.BadRequest = class BadRequest extends (
  Error
) {
  constructor(message) {
    super(message);
    this.status = 400;
    this.stack = null;
  }
};

exports.NotAuthorized = class NotAuthorized extends (
  Error
) {
  constructor(message) {
    super(message);
    this.status = 401;
    this.stack = null;
  }
};

exports.LoginOccupied = class LoginOccupied extends (
  Error
) {
  constructor(message) {
    super(message);
    this.status = 409;
    this.stack = null;
  }
};
