const Dashboard = require("../models/dashboard.model");

class DashboardService {

    static async getStats() {

        return await Dashboard.getStats();

    }

    static async getRecentAlerts() {

        return await Dashboard.getRecentAlerts();

    }

}

module.exports = DashboardService;