"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mkdirp_1 = __importDefault(require("mkdirp"));
const path_1 = __importDefault(require("path"));
const mime_1 = __importDefault(require("mime"));
const errors_1 = require("../errors");
const saveBufferToFile_1 = __importDefault(require("./saveBufferToFile"));
const getSafeFilename_1 = __importDefault(require("./getSafeFilename"));
const getImageSize_1 = __importDefault(require("./getImageSize"));
const imageResizer_1 = __importDefault(require("./imageResizer"));
const isImage_1 = __importDefault(require("./isImage"));
const uploadFile = async ({ config, collection: { config: collectionConfig, Model, }, req, data, throwOnMissingFile, overwriteExistingFiles, }) => {
    let newData = data;
    if (collectionConfig.upload) {
        const fileData = {};
        const { staticDir, imageSizes, disableLocalStorage } = collectionConfig.upload;
        const { file } = req.files || {};
        if (throwOnMissingFile && !file) {
            throw new errors_1.MissingFile();
        }
        let staticPath = staticDir;
        if (staticDir.indexOf('/') !== 0) {
            staticPath = path_1.default.resolve(config.paths.configDir, staticDir);
        }
        if (!disableLocalStorage) {
            mkdirp_1.default.sync(staticPath);
        }
        if (file) {
            const fsSafeName = !overwriteExistingFiles ? await (0, getSafeFilename_1.default)(Model, staticPath, file.name) : file.name;
            try {
                if (!disableLocalStorage) {
                    await (0, saveBufferToFile_1.default)(file.data, `${staticPath}/${fsSafeName}`);
                }
                fileData.filename = fsSafeName;
                fileData.filesize = file.size;
                fileData.mimeType = file.mimetype || mime_1.default.getType(fsSafeName);
                if ((0, isImage_1.default)(file.mimetype)) {
                    const dimensions = await (0, getImageSize_1.default)(file);
                    fileData.width = dimensions.width;
                    fileData.height = dimensions.height;
                    if (Array.isArray(imageSizes) && file.mimetype !== 'image/svg+xml') {
                        req.payloadUploadSizes = {};
                        fileData.sizes = await (0, imageResizer_1.default)({
                            req,
                            file: file.data,
                            dimensions,
                            staticPath,
                            config: collectionConfig,
                            savedFilename: fsSafeName,
                            mimeType: fileData.mimeType,
                        });
                    }
                }
            }
            catch (err) {
                console.error(err);
                throw new errors_1.FileUploadError();
            }
            newData = {
                ...newData,
                ...fileData,
            };
        }
    }
    return newData;
};
exports.default = uploadFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBsb2FkRmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91cGxvYWRzL3VwbG9hZEZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvREFBNEI7QUFDNUIsZ0RBQXdCO0FBQ3hCLGdEQUF3QjtBQUd4QixzQ0FBeUQ7QUFHekQsMEVBQWtEO0FBQ2xELHdFQUFnRDtBQUNoRCxrRUFBMEM7QUFDMUMsa0VBQTJDO0FBQzNDLHdEQUFnQztBQVdoQyxNQUFNLFVBQVUsR0FBRyxLQUFLLEVBQUUsRUFDeEIsTUFBTSxFQUNOLFVBQVUsRUFBRSxFQUNWLE1BQU0sRUFBRSxnQkFBZ0IsRUFDeEIsS0FBSyxHQUNOLEVBQ0QsR0FBRyxFQUNILElBQUksRUFDSixrQkFBa0IsRUFDbEIsc0JBQXNCLEdBQ2pCLEVBQW9DLEVBQUU7SUFDM0MsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDO0lBRW5CLElBQUksZ0JBQWdCLENBQUMsTUFBTSxFQUFFO1FBQzNCLE1BQU0sUUFBUSxHQUFzQixFQUFFLENBQUM7UUFFdkMsTUFBTSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsbUJBQW1CLEVBQUUsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUM7UUFFL0UsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDO1FBRWpDLElBQUksa0JBQWtCLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDL0IsTUFBTSxJQUFJLG9CQUFXLEVBQUUsQ0FBQztTQUN6QjtRQUVELElBQUksVUFBVSxHQUFHLFNBQVMsQ0FBQztRQUUzQixJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2hDLFVBQVUsR0FBRyxjQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1NBQzlEO1FBRUQsSUFBSSxDQUFDLG1CQUFtQixFQUFFO1lBQ3hCLGdCQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ3pCO1FBRUQsSUFBSSxJQUFJLEVBQUU7WUFDUixNQUFNLFVBQVUsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUEseUJBQWUsRUFBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUU3RyxJQUFJO2dCQUNGLElBQUksQ0FBQyxtQkFBbUIsRUFBRTtvQkFDeEIsTUFBTSxJQUFBLDBCQUFnQixFQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxVQUFVLElBQUksVUFBVSxFQUFFLENBQUMsQ0FBQztpQkFDbEU7Z0JBRUQsUUFBUSxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUM7Z0JBQy9CLFFBQVEsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDOUIsUUFBUSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxJQUFJLGNBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBRTlELElBQUksSUFBQSxpQkFBTyxFQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtvQkFDMUIsTUFBTSxVQUFVLEdBQUcsTUFBTSxJQUFBLHNCQUFZLEVBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzVDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQztvQkFDbEMsUUFBUSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDO29CQUVwQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxlQUFlLEVBQUU7d0JBQ2xFLEdBQUcsQ0FBQyxrQkFBa0IsR0FBRyxFQUFFLENBQUM7d0JBQzVCLFFBQVEsQ0FBQyxLQUFLLEdBQUcsTUFBTSxJQUFBLHNCQUFhLEVBQUM7NEJBQ25DLEdBQUc7NEJBQ0gsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJOzRCQUNmLFVBQVU7NEJBQ1YsVUFBVTs0QkFDVixNQUFNLEVBQUUsZ0JBQWdCOzRCQUN4QixhQUFhLEVBQUUsVUFBVTs0QkFDekIsUUFBUSxFQUFFLFFBQVEsQ0FBQyxRQUFRO3lCQUM1QixDQUFDLENBQUM7cUJBQ0o7aUJBQ0Y7YUFDRjtZQUFDLE9BQU8sR0FBRyxFQUFFO2dCQUNaLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ25CLE1BQU0sSUFBSSx3QkFBZSxFQUFFLENBQUM7YUFDN0I7WUFFRCxPQUFPLEdBQUc7Z0JBQ1IsR0FBRyxPQUFPO2dCQUNWLEdBQUcsUUFBUTthQUNaLENBQUM7U0FDSDtLQUNGO0lBRUQsT0FBTyxPQUFPLENBQUM7QUFDakIsQ0FBQyxDQUFDO0FBRUYsa0JBQWUsVUFBVSxDQUFDIn0=