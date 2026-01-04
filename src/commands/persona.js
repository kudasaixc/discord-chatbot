import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { generatePersonaFromIdea } from "../services/personaGenerator.js";

export const data = new SlashCommandBuilder()
  .setName("persona")
  .setDescription("Gérer les personas")
  .addSubcommand(sub =>
    sub
      .setName("create")
      .setDescription("Créer une nouvelle persona")
      .addStringOption(option =>
        option.setName("nom").setDescription("Nom unique de la persona").setRequired(true)
      )
      .addStringOption(option =>
        option.setName("description").setDescription("Description/comportement de la persona").setRequired(true)
      )
      .addNumberOption(option =>
        option
          .setName("temperature")
          .setDescription(
            "Contrôle la créativité (0-2). Valeur haute = réponses plus libres/imprévisibles. Optionnel."
          )
      )
      .addNumberOption(option =>
        option
          .setName("top_p")
          .setDescription(
            "Sélectionne le haut des probabilités (0-1). Valeur haute = sortie plus libre/chaotique. Optionnel."
          )
      )
      .addNumberOption(option =>
        option
          .setName("presence_penalty")
          .setDescription(
            "Décourage les répétitions. Valeur haute = explore de nouveaux sujets (peut sembler moins cohérent)."
          )
      )
      .addNumberOption(option =>
        option
          .setName("frequency_penalty")
          .setDescription(
            "Pénalise la répétition de mots. Valeur haute = style plus varié/imprévisible. Optionnel."
          )
      )
      .addIntegerOption(option =>
        option
          .setName("max_tokens")
          .setDescription("Longueur max de réponse. Plus c'est bas, plus c'est concis. Optionnel.")
      )
  )
  .addSubcommand(sub =>
    sub
      .setName("set")
      .setDescription("Activer une persona existante")
      .addStringOption(option => option.setName("nom").setDescription("Nom de la persona à activer").setRequired(true))
  )
  .addSubcommand(sub =>
    sub
      .setName("delete")
      .setDescription("Supprimer une persona existante")
      .addStringOption(option => option.setName("nom").setDescription("Nom de la persona à supprimer").setRequired(true))
  )
  .addSubcommand(sub =>
    sub
      .setName("autocreate")
      .setDescription("Générer une persona automatiquement via l'API OpenAI")
      .addStringOption(option => option.setName("idee").setDescription("Description de la persona désirée").setRequired(true))
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function execute({ interaction, openai, store }) {
  const sub = interaction.options.getSubcommand();

  if (sub === "create") {
    await handleCreate(interaction, store);
    return;
  }

  if (sub === "set") {
    await handleSet(interaction, store);
    return;
  }

  if (sub === "delete") {
    await handleDelete(interaction, store);
    return;
  }

  if (sub === "autocreate") {
    await handleAutoCreate(interaction, openai, store);
  }
}

async function handleCreate(interaction, store) {
  const name = interaction.options.getString("nom");
  const description = interaction.options.getString("description");
  const parameters = {
    temperature: interaction.options.getNumber("temperature"),
    top_p: interaction.options.getNumber("top_p"),
    presence_penalty: interaction.options.getNumber("presence_penalty"),
    frequency_penalty: interaction.options.getNumber("frequency_penalty"),
    max_tokens: interaction.options.getInteger("max_tokens")
  };

  const filteredParameters = Object.fromEntries(
    Object.entries(parameters).filter(([, value]) => value !== null && value !== undefined)
  );

  store.createPersona(interaction.guildId, name, description, filteredParameters);
  await interaction.reply({ content: `La persona **${name}** a été ajoutée.`, ephemeral: true });
}

async function handleSet(interaction, store) {
  const name = interaction.options.getString("nom");
  try {
    store.setActivePersona(interaction.guildId, name);
    const personas = store.getGuildPersonas(interaction.guildId);
    const list = Object.keys(personas)
      .map(personaName => `${personaName === name ? "(active) " : ""}${personaName}`)
      .join(", ");
    await interaction.reply({
      content: `La persona active est maintenant **${name}**. Personas disponibles : ${list}`
    });
  } catch (error) {
    await interaction.reply({ content: error.message, ephemeral: true });
  }
}

async function handleDelete(interaction, store) {
  const name = interaction.options.getString("nom");
  try {
    store.deletePersona(interaction.guildId, name);
    const personas = store.getGuildPersonas(interaction.guildId);
    const list = Object.keys(personas).join(", ") || "aucune";
    await interaction.reply({
      content: `La persona **${name}** a été supprimée. Personas restantes : ${list}`,
      ephemeral: true
    });
  } catch (error) {
    await interaction.reply({ content: error.message, ephemeral: true });
  }
}

async function handleAutoCreate(interaction, openai, store) {
  const idea = interaction.options.getString("idee");
  await interaction.deferReply({ ephemeral: true });

  try {
    const { name, description, usageTokens } = await generatePersonaFromIdea(openai, store, idea);

    const existing = store.getGuildPersonas(interaction.guildId);
    const baseName = name || "persona-auto";
    let finalName = baseName;
    let suffix = 1;
    while (existing[finalName]) {
      finalName = `${baseName}-${suffix++}`;
    }

    store.createPersona(interaction.guildId, finalName, description);
    store.setActivePersona(interaction.guildId, finalName);
    store.addUsage(interaction.guildId, usageTokens);

    await interaction.editReply({
      content: [`Persona générée et activée : **${finalName}**`, `Description : ${description}`].join("\n")
    });
  } catch (error) {
    console.error("Erreur lors de la génération automatique de persona", error);
    await interaction.editReply({
      content: "Impossible de générer automatiquement la persona pour le moment. Merci de réessayer.",
      ephemeral: true
    });
  }
}
