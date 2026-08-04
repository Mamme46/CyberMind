const Upload = require("../models/upload.model");

class UploadService {

    static async upload(userId,file){

        if(!file){

            throw new Error("No file uploaded.");

        }

        return await Upload.create({

            userId,

            originalName:file.originalname,

            storedName:file.filename,

            mimeType:file.mimetype,

            fileSize:file.size

        });

    }

}

module.exports = UploadService;