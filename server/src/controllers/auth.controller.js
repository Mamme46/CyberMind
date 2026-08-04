const AuthService = require("../services/auth.service");

class AuthController {

    static async register(req, res) {

        try {

            const { username, email, password } = req.body;

            const user = await AuthService.register(
                username,
                email,
                password
            );

            res.status(201).json({

                success: true,
                message: "User created successfully.",

                data: user

            });

        }

        catch (error) {

            res.status(400).json({

                success: false,

                message: error.message

            });

        }

    }

    static async login(req, res) {

        try {

            const { email, password } = req.body;

            const result = await AuthService.login(

                email,
                password

            );

            res.status(200).json({

                success: true,

                message: "Login successful.",

                data: result

            });

        }

        catch (error) {

            res.status(401).json({

                success: false,

                message: error.message

            });

        }

    }

}

module.exports = AuthController;