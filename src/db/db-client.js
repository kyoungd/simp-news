const { PrismaClient } = require('@prisma/client');

class DBClient {
    constructor() {
        this._prisma = new PrismaClient();
    }

    // singleton pattern
    static get instance() {
        if (!this[Symbol.for('instance')]) {
            this[Symbol.for('instance')] = new DBClient();
        }
        return this[Symbol.for('instance')];
    }

    get prisma() {
        return this._prisma;
    }

}

module.exports = DBClient
