const DashboardService = require("../services/dashboard.service");

class DashboardController {

    static async getStats(req, res) {

        try {

            const stats = await DashboardService.getStats();

            res.json({

                success: true,

                data: stats

            });

        }

        catch (error) {

            res.status(500).json({

                success: false,

                message: error.message

            });

        }

    }

    static async getRecentAlerts(req, res) {

        try {

            const alerts = await DashboardService.getRecentAlerts();

            res.json({

                success: true,

                data: alerts

            });

        }

        catch (error) {

            res.status(500).json({

                success: false,

                message: error.message

            });

        }

    }

}

module.exports = DashboardController;