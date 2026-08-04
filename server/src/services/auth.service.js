const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");
const env = require("../config/env");

class AuthService {

    static async register(username, email, password) {

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findByEmail(email);

        if (existingUser) {
            throw new Error("Email already exists.");
        }

        // Hasher le mot de passe
        const passwordHash = await bcrypt.hash(password, 10);

        // Créer l'utilisateur
        const user = await User.create(
            username,
            email,
            passwordHash
        );

        return user;
    }

    static async login(email, password) {

        // Chercher l'utilisateur
        const user = await User.findByEmail(email);

        if (!user) {
            throw new Error("Invalid email or password.");
        }

        // Comparer le mot de passe
        const isMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!isMatch) {
            throw new Error("Invalid email or password.");
        }

        // Générer un JWT
        const token = jwt.sign(

            {
                id: user.id,
                email: user.email
            },

            env.JWT_SECRET,

            {
                expiresIn: "24h"
            }

        );

        return {

            user: {

                id: user.id,
                username: user.username,
                email: user.email

            },

            token

        };

    }

}

module.exports = AuthService;