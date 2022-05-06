"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
const webpack_1 = __importDefault(require("webpack"));
const babel_config_1 = __importDefault(require("../babel.config"));
const mockModulePath = path_1.default.resolve(__dirname, './mocks/emptyModule.js');
const mockDotENVPath = path_1.default.resolve(__dirname, './mocks/dotENV.js');
exports.default = (config) => ({
    entry: {
        main: [
            path_1.default.resolve(__dirname, '../admin'),
        ],
    },
    resolveLoader: {
        modules: ['node_modules', path_1.default.join(__dirname, '../../node_modules')],
    },
    module: {
        rules: [
            {
                test: /\.(t|j)sx?$/,
                exclude: /node_modules[\\/](?!(@payloadcms[\\/]payload)[\\/]).*/,
                use: [
                    {
                        loader: require.resolve('babel-loader'),
                        options: babel_config_1.default,
                    },
                ],
            },
            {
                oneOf: [
                    {
                        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                        type: 'asset/resource',
                    },
                    {
                        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
                        type: 'asset/inline',
                    },
                ],
            },
        ],
    },
    resolve: {
        fallback: {
            path: require.resolve('path-browserify'),
            crypto: false,
            https: false,
            http: false,
        },
        modules: ['node_modules', path_1.default.resolve(__dirname, '../../node_modules')],
        alias: {
            'payload-config': config.paths.config,
            payload$: mockModulePath,
            'payload-user-css': config.admin.css,
            'payload-scss-overrides': config.admin.scss,
            dotenv: mockDotENVPath,
        },
        extensions: ['.ts', '.tsx', '.js', '.json'],
    },
    plugins: [
        new webpack_1.default.ProvidePlugin({ process: 'process/browser' }),
        new webpack_1.default.DefinePlugin(Object.entries(process.env).reduce((values, [key, val]) => {
            if (key.indexOf('PAYLOAD_PUBLIC_') === 0) {
                return ({
                    ...values,
                    [`process.env.${key}`]: `'${val}'`,
                });
            }
            return values;
        }, {})),
        new html_webpack_plugin_1.default({
            template: config.admin.indexHTML,
            filename: path_1.default.normalize('./index.html'),
        }),
        new webpack_1.default.HotModuleReplacementPlugin(),
    ],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0QmFzZUNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy93ZWJwYWNrL2dldEJhc2VDb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxnREFBd0I7QUFDeEIsOEVBQW9EO0FBQ3BELHNEQUFpRDtBQUVqRCxtRUFBMEM7QUFFMUMsTUFBTSxjQUFjLEdBQUcsY0FBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztBQUN6RSxNQUFNLGNBQWMsR0FBRyxjQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0FBRXBFLGtCQUFlLENBQUMsTUFBdUIsRUFBaUIsRUFBRSxDQUFDLENBQUM7SUFDMUQsS0FBSyxFQUFFO1FBQ0wsSUFBSSxFQUFFO1lBQ0osY0FBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDO1NBQ3BDO0tBQ0Y7SUFDRCxhQUFhLEVBQUU7UUFDYixPQUFPLEVBQUUsQ0FBQyxjQUFjLEVBQUUsY0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztLQUN0RTtJQUNELE1BQU0sRUFBRTtRQUNOLEtBQUssRUFBRTtZQUNMO2dCQUNFLElBQUksRUFBRSxhQUFhO2dCQUNuQixPQUFPLEVBQUUsdURBQXVEO2dCQUNoRSxHQUFHLEVBQUU7b0JBQ0g7d0JBQ0UsTUFBTSxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDO3dCQUN2QyxPQUFPLEVBQUUsc0JBQVc7cUJBQ3JCO2lCQUNGO2FBQ0Y7WUFDRDtnQkFDRSxLQUFLLEVBQUU7b0JBQ0w7d0JBQ0UsSUFBSSxFQUFFLDhCQUE4Qjt3QkFDcEMsSUFBSSxFQUFFLGdCQUFnQjtxQkFDdkI7b0JBQ0Q7d0JBQ0UsSUFBSSxFQUFFLGdDQUFnQzt3QkFDdEMsSUFBSSxFQUFFLGNBQWM7cUJBQ3JCO2lCQUNGO2FBQ0Y7U0FDRjtLQUNGO0lBQ0QsT0FBTyxFQUFFO1FBQ1AsUUFBUSxFQUFFO1lBQ1IsSUFBSSxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUM7WUFDeEMsTUFBTSxFQUFFLEtBQUs7WUFDYixLQUFLLEVBQUUsS0FBSztZQUNaLElBQUksRUFBRSxLQUFLO1NBQ1o7UUFDRCxPQUFPLEVBQUUsQ0FBQyxjQUFjLEVBQUUsY0FBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztRQUN4RSxLQUFLLEVBQUU7WUFDTCxnQkFBZ0IsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU07WUFDckMsUUFBUSxFQUFFLGNBQWM7WUFDeEIsa0JBQWtCLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHO1lBQ3BDLHdCQUF3QixFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSTtZQUMzQyxNQUFNLEVBQUUsY0FBYztTQUN2QjtRQUNELFVBQVUsRUFBRSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQztLQUM1QztJQUNELE9BQU8sRUFBRTtRQUNQLElBQUksaUJBQU8sQ0FBQyxhQUFhLENBQ3ZCLEVBQUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLENBQy9CO1FBQ0QsSUFBSSxpQkFBTyxDQUFDLFlBQVksQ0FDdEIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUNoQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFO1lBQ3JCLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDeEMsT0FBTyxDQUFDO29CQUNOLEdBQUcsTUFBTTtvQkFDVCxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLEdBQUcsR0FBRztpQkFDbkMsQ0FBQyxDQUFDO2FBQ0o7WUFFRCxPQUFPLE1BQU0sQ0FBQztRQUNoQixDQUFDLEVBQ0QsRUFBRSxDQUNILENBQ0Y7UUFDRCxJQUFJLDZCQUFpQixDQUFDO1lBQ3BCLFFBQVEsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVM7WUFDaEMsUUFBUSxFQUFFLGNBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDO1NBQ3pDLENBQUM7UUFDRixJQUFJLGlCQUFPLENBQUMsMEJBQTBCLEVBQUU7S0FDekM7Q0FDRixDQUFDLENBQUMifQ==