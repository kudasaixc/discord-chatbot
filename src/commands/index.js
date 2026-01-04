import * as benchmark from "./benchmark.js";
import * as clearContext from "./clearContext.js";
import * as dashboard from "./dashboard.js";
import * as help from "./help.js";
import * as model from "./model.js";
import * as persona from "./persona.js";
import * as personas from "./personas.js";

export const commandModules = [help, personas, persona, clearContext, dashboard, model, benchmark];

export const commandData = commandModules.map(command => command.data);
export const commandHandlers = new Map(commandModules.map(command => [command.data.name, command.execute]));
