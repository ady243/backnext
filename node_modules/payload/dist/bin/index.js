"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-var-requires */
const minimist_1 = __importDefault(require("minimist"));
const generateTypes_1 = require("./generateTypes");
const babel_config_1 = __importDefault(require("../babel.config"));
require('@babel/register')({
    ...babel_config_1.default,
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
});
const { build } = require('./build');
const args = (0, minimist_1.default)(process.argv.slice(2));
const scriptIndex = args._.findIndex((x) => x === 'build');
const script = scriptIndex === -1 ? args._[0] : args._[scriptIndex];
switch (script) {
    case 'build': {
        build();
        break;
    }
    case 'generate:types': {
        (0, generateTypes_1.generateTypes)();
        break;
    }
    default:
        console.log(`Unknown script "${script}".`);
        break;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYmluL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsdURBQXVEO0FBQ3ZELHdEQUFnQztBQUNoQyxtREFBZ0Q7QUFDaEQsbUVBQTBDO0FBRTFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3pCLEdBQUcsc0JBQVc7SUFDZCxVQUFVLEVBQUUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUM7Q0FDM0MsQ0FBQyxDQUFDO0FBRUgsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUVyQyxNQUFNLElBQUksR0FBRyxJQUFBLGtCQUFRLEVBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUU3QyxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FDbEMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxPQUFPLENBQ3JCLENBQUM7QUFFRixNQUFNLE1BQU0sR0FBRyxXQUFXLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7QUFFcEUsUUFBUSxNQUFNLEVBQUU7SUFDZCxLQUFLLE9BQU8sQ0FBQyxDQUFDO1FBQ1osS0FBSyxFQUFFLENBQUM7UUFDUixNQUFNO0tBQ1A7SUFFRCxLQUFLLGdCQUFnQixDQUFDLENBQUM7UUFDckIsSUFBQSw2QkFBYSxHQUFFLENBQUM7UUFDaEIsTUFBTTtLQUNQO0lBR0Q7UUFDRSxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixNQUFNLElBQUksQ0FBQyxDQUFDO1FBQzNDLE1BQU07Q0FDVCJ9