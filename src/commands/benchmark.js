import { MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { BENCHMARK_MODELS } from "../constants.js";

export const data = new SlashCommandBuilder()
  .setName("benchmark")
  .setDescription("Tester les modèles accessibles avec la clé API (propriétaire seulement)")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function execute({ interaction, openai, ownerId }) {
  if (interaction.user.id !== ownerId) {
    await interaction.reply({
      content: "Seul le propriétaire du bot peut lancer le benchmark des modèles",
      flags: MessageFlags.Ephemeral
    });
    return;
  }

  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  const results = [];
  for (const model of BENCHMARK_MODELS) {
    try {
      await openai.models.retrieve(model);
      results.push({ model, ok: true });
    } catch (error) {
      const message = error?.response?.data?.error?.message || error.message || "Motif inconnu";
      results.push({ model, ok: false, message });
    }
  }

  const accessible = results.filter(result => result.ok).map(result => result.model);
  const rejected = results.filter(result => !result.ok);

  const lines = [
    `Benchmark terminé pour ${results.length} modèles :`,
    `Accessible (${accessible.length}) : ${accessible.join(", ") || "aucun"}.`,
    `Inaccessibles (${rejected.length}) : ${
      rejected.map(result => `${result.model} (${result.message})`).join("; ") || "aucun"
    }.`
  ];

  await interaction.editReply({ content: lines.join("\n") });
}
