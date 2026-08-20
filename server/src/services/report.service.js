const Report = require("../models/report.model");

class ReportService {

    static async create(report) {

        return await Report.create(report);

    }

    static async getReports() {

        return await Report.findAll();

    }

    static async getReport(id) {

        return await Report.findById(id);

    }

    static async deleteReport(id) {

        return await Report.delete(id);

    }

}

module.exports = ReportService;