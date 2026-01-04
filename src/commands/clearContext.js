import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("clearcontext")
  .setDescription("Vider le contexte de ce salon")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function execute({ interaction, store }) {
  store.clearContext(interaction.guildId, interaction.channelId);
  await interaction.reply({ content: "Tout le contexte de ce salon a été vidé." });
}
