import fs from "fs";
import path from "path";
import { DEFAULT_MODEL } from "./constants.js";

const DATA_PATH = path.resolve("data", "persona-data.json");

function ensureDataFile() {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_PATH)) {
    const seed = { personas: {}, currentPersona: {}, usage: {}, model: DEFAULT_MODEL };
    fs.writeFileSync(DATA_PATH, JSON.stringify(seed, null, 2));
  }
}

function readData() {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_PATH, "utf8");
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

export class DataStore {
  constructor() {
    this.memoryContext = new Map(); // key: guildId:channelId => messages
  }

  getGuildPersonas(guildId) {
    const data = readData();
    if (!data.personas[guildId]) {
      data.personas[guildId] = {};
    }
    if (!data.personas[guildId].default) {
      data.personas[guildId].default = "Tu es Kudachat, un bot Discord serviable créé par kudasai_. Reste poli et clair.";
      writeData(data);
    }
    return data.personas[guildId];
  }

  createPersona(guildId, name, description) {
    const data = readData();
    if (!data.personas[guildId]) data.personas[guildId] = {};
    data.personas[guildId][name] = description;
    writeData(data);
  }

  deletePersona(guildId, name) {
    const data = readData();
    const personas = this.getGuildPersonas(guildId);
    if (!personas[name]) {
      throw new Error("Persona introuvable pour ce serveur.");
    }
    delete personas[name];
    data.personas[guildId] = personas;

    if (data.currentPersona[guildId] === name) {
      const remaining = Object.keys(personas);
      data.currentPersona[guildId] = remaining[0] || "default";
    }

    writeData(data);
  }

  setActivePersona(guildId, name) {
    const data = readData();
    const personas = this.getGuildPersonas(guildId);
    if (!personas || !personas[name]) {
      throw new Error("Persona introuvable pour ce serveur.");
    }
    data.personas[guildId] = personas;
    data.currentPersona[guildId] = name;
    writeData(data);
  }

  getActivePersona(guildId) {
    const data = readData();
    const personas = this.getGuildPersonas(guildId);
    const personaName = data.currentPersona[guildId] || Object.keys(personas)[0];
    return { name: personaName, description: personas[personaName] };
  }

  getModel() {
    const data = readData();
    return data.model || DEFAULT_MODEL;
  }

  setModel(model) {
    const data = readData();
    data.model = model;
    writeData(data);
  }

  clearContext(guildId, channelId) {
    this.memoryContext.delete(`${guildId}:${channelId}`);
  }

  pushToContext(guildId, channelId, entry) {
    const key = `${guildId}:${channelId}`;
    const existing = this.memoryContext.get(key) || [];
    existing.push(entry);
    this.memoryContext.set(key, existing);
  }

  getContext(guildId, channelId) {
    return this.memoryContext.get(`${guildId}:${channelId}`) || [];
  }

  trimContext(guildId, channelId, limit) {
    const key = `${guildId}:${channelId}`;
    const existing = this.memoryContext.get(key) || [];
    if (existing.length > limit) {
      this.memoryContext.set(key, existing.slice(existing.length - limit));
    }
  }

  addUsage(guildId, tokens = 0) {
    const data = readData();
    if (!data.usage[guildId]) data.usage[guildId] = 0;
    data.usage[guildId] += tokens;
    writeData(data);
  }

  getUsage(guildId) {
    const data = readData();
    return data.usage[guildId] || 0;
  }
}
