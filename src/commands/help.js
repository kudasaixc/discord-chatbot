import { MessageFlags, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder().setName("help").setDescription("Afficher l'aide de Kudachat");

export async function execute({ interaction }) {
  const content = [
    "Aide Kudachat — Liste des commandes disponibles :",
    "• /help : afficher cette aide",
    "• /personas : lister les personas (admin)",
    "• /persona create : créer une nouvelle persona (admin)",
    "• /persona autocreate : générer une persona automatiquement (admin)",
    "• /persona set : activer une persona existante (admin)",
    "• /persona delete : supprimer une persona (admin)",
    "• /clearcontext : vider le contexte du salon (admin)",
    "• /dashboard : voir l'estimation d'usage (admin)",
    "• /model set : changer le modèle (propriétaire seulement)",
    "• /benchmark : tester l'accès aux modèles OpenAI (propriétaire)"
  ].join("\n");

  await interaction.reply({ content, flags: MessageFlags.Ephemeral });
}
