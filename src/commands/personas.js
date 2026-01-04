import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { formatParameters } from "../utils/formatParameters.js";

export const data = new SlashCommandBuilder()
  .setName("personas")
  .setDescription("Lister les personas disponibles pour ce serveur")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function execute({ interaction, store }) {
  const personas = store.getGuildPersonas(interaction.guildId);
  const activePersona = store.getActivePersona(interaction.guildId).name;
  const description = Object.entries(personas)
    .map(([name, persona]) => {
      const normalized = persona?.description ? persona : { description: String(persona || ""), parameters: {} };
      const parameters = formatParameters(normalized.parameters);
      const paramSuffix = parameters ? ` [${parameters}]` : "";
      return `${name === activePersona ? "(active) " : ""}${name} : ${normalized.description}${paramSuffix}`;
    })
    .join("\n");

  const content = description || "Aucune persona définie";
  await interaction.reply({ content, ephemeral: true });
}
