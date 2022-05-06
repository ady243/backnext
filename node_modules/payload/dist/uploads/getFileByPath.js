"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const mime_1 = __importDefault(require("mime"));
const path_1 = __importDefault(require("path"));
const getFileByPath = (filePath) => {
    if (typeof filePath === 'string') {
        const data = fs_1.default.readFileSync(filePath);
        const mimetype = mime_1.default.getType(filePath);
        const { size } = fs_1.default.statSync(filePath);
        const name = path_1.default.basename(filePath);
        return {
            data,
            mimetype,
            name,
            size,
        };
    }
    return undefined;
};
exports.default = getFileByPath;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0RmlsZUJ5UGF0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91cGxvYWRzL2dldEZpbGVCeVBhdGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw0Q0FBb0I7QUFDcEIsZ0RBQXdCO0FBQ3hCLGdEQUF3QjtBQUd4QixNQUFNLGFBQWEsR0FBRyxDQUFDLFFBQWdCLEVBQVEsRUFBRTtJQUMvQyxJQUFJLE9BQU8sUUFBUSxLQUFLLFFBQVEsRUFBRTtRQUNoQyxNQUFNLElBQUksR0FBRyxZQUFFLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZDLE1BQU0sUUFBUSxHQUFHLGNBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDeEMsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLFlBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFdkMsTUFBTSxJQUFJLEdBQUcsY0FBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVyQyxPQUFPO1lBQ0wsSUFBSTtZQUNKLFFBQVE7WUFDUixJQUFJO1lBQ0osSUFBSTtTQUNMLENBQUM7S0FDSDtJQUVELE9BQU8sU0FBUyxDQUFDO0FBQ25CLENBQUMsQ0FBQztBQUVGLGtCQUFlLGFBQWEsQ0FBQyJ9