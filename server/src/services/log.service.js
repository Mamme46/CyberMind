const LogEvent = require("../models/logEvent.model");

class LogService {

    static async getLogs(uploadId){

        return await LogEvent.findByUploadId(uploadId);

    }

}

module.exports = LogService;
