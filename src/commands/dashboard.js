import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { COST_PER_TOKEN_USD } from "../constants.js";

export const data = new SlashCommandBuilder()
  .setName("dashboard")
  .setDescription("Voir l'estimation d'usage de l'API")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function execute({ interaction, store }) {
  const tokens = store.getUsage(interaction.guildId);
  const cost = tokens * COST_PER_TOKEN_USD;
  const lines = [
    "Tableau de bord de l'usage :",
    `Tokens utilisés : ${tokens}`,
    `Coût estimé : $${cost.toFixed(4)}`,
    `Modèle actuel : ${store.getModel()}`
  ];

  await interaction.reply({ content: lines.join("\n"), ephemeral: true });
}
