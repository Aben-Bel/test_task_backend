"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Verification {
    get email() {
        return this._email;
    }
    set email(value) {
        this._email = value;
    }
    get secret() {
        return this._secret;
    }
    set secret(value) {
        this._secret = value;
    }
    constructor(email, secret) {
        this._email = email;
        this._secret = secret;
    }
}
exports.default = Verification;
