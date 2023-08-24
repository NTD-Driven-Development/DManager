import request from "supertest"
import app from "../src/index"

global.console = require("console")
jest.spyOn(console, "log").mockImplementation(() => {})

export const App = request(app)
