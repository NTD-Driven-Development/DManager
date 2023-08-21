import request from "supertest"
import app from "../src/index"

global.console = require("console")

export const App = request(app)
