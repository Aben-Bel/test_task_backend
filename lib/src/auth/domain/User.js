"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get email() {
        return this._email;
    }
    set email(value) {
        this._email = value;
    }
    get password() {
        return this._password;
    }
    set password(value) {
        this._password = value;
    }
    constructor(id, email, password) {
        this._email = email;
        this._password = password;
        this._id = id;
    }
    checkEmailEquality(email) {
        return email === this.email;
    }
}
exports.default = User;
