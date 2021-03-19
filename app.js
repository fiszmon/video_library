import express from 'express'
const app = express();
import { router } from './routes/routes.js'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from "dotenv"
dotenv.config();
import swaggerUi from "swagger-ui-express"
import swaggerJsdoc from "swagger-jsdoc"

// var YAML = require("yamljs");
// var swaggerConfig = YAML.load("./api/swagger/swagger.yaml");

const options = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Video library API with Swagger",
            version: "0.0.5 beta", // TODO add to env variable VERSIOn
            description: "This is a simple API application made with Express and documented with Swagger",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        }
    },
    apis: ["./routes/routes.js"],
};

app.use(express.json());
app.use(cors());
app.use('/', router);


mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    app.listen(8080, async() => {
        const specs = await swaggerJsdoc(options);
        app.use(
            "/api-docs",
            swaggerUi.serve,
            swaggerUi.setup(specs)
        );
        console.log("Server started");
    });
})