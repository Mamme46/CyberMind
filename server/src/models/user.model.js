const { pool } = require("../config/database");

class User {

    static async create(username, email, passwordHash) {

        const query = `
            INSERT INTO users(username,email,password_hash)
            VALUES($1,$2,$3)
            RETURNING *;
        `;

        const { rows } = await pool.query(query, [
            username,
            email,
            passwordHash
        ]);

        return rows[0];
    }

    static async findById(id) {

        const { rows } = await pool.query(
            "SELECT * FROM users WHERE id=$1",
            [id]
        );

        return rows[0];
    }

    static async findByEmail(email) {

        const { rows } = await pool.query(
            "SELECT * FROM users WHERE email=$1",
            [email]
        );

        return rows[0];
    }

    static async findAll() {

        const { rows } = await pool.query(
            "SELECT * FROM users"
        );

        return rows;
    }

    static async delete(id) {

        await pool.query(
            "DELETE FROM users WHERE id=$1",
            [id]
        );

    }

}

module.exports = User;