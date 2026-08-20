const SecurityService = require("../services/security.service");

class SecurityController {

    static async scan(req, res) {

        try {

            const result = await SecurityService.scan();

            res.json({

                success: true,

                data: result

            });

        }

        catch (error) {

            console.error(
                "Security scan error:",
                error
            );

            res.status(500).json({

                success: false,

                message: error.message

            });

        }

    }

}

module.exports = SecurityController;