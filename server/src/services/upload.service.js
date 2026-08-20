const Upload = require("../models/upload.model");
const ParserService = require("./parser.service");
const DetectionService = require("../detection/detection.service");

class UploadService {

    static async upload(userId, file) {

        if (!file) {
            throw new Error("No file uploaded.");
        }

        const upload = await Upload.create({

            userId,

            originalName: file.originalname,

            storedName: file.filename,

            mimeType: file.mimetype,

            fileSize: file.size

        });
        
        console.log("🔥 ABOUT TO CALL PARSER SERVICE 🔥");
        console.log("🔥 PARSER SERVICE PATH:", require.resolve("./parser.service"));

        await ParserService.parse({

            id: upload.id,

            filePath: file.path

        });

        await DetectionService.analyze(upload.id);

        return upload;

    }

    static async getUploads() {

    return await Upload.findAll();

}

static async getUpload(id) {

    return await Upload.findById(id);

}

}

module.exports = UploadService;