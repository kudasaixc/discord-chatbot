import { MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { ALLOWED_MODELS } from "../constants.js";

export const data = new SlashCommandBuilder()
  .setName("model")
  .setDescription("Changer le modèle OpenAI (réservé au propriétaire)")
  .addSubcommand(sub =>
    sub
      .setName("set")
      .setDescription("Définir le modèle OpenAI à utiliser")
      .addStringOption(option =>
        option.setName("nom").setDescription("Nom du modèle parmi la liste autorisée").setRequired(true)
      )
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function execute({ interaction, ownerId, store }) {
  if (interaction.user.id !== ownerId) {
    await interaction.reply({
      content: "Seul le propriétaire du bot peut changer le modèle",
      flags: MessageFlags.Ephemeral
    });
    return;
  }

  const sub = interaction.options.getSubcommand();
  if (sub === "set") {
    const name = interaction.options.getString("nom");
    if (!ALLOWED_MODELS.includes(name)) {
      await interaction.reply({ content: `Le modèle **${name}** n'est pas autorisé.`, flags: MessageFlags.Ephemeral });
      return;
    }
    store.setModel(name);
    await interaction.reply({ content: `Le modèle OpenAI actif est maintenant **${name}**.` });
  }
}
