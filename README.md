# Kudachat

Bot Discord (Node.js) qui combine Discord.js et l'API OpenAI pour répondre naturellement lorsqu'il est mentionné. Il prend en charge des personas configurables par serveur, la gestion du contexte et le suivi de l'usage des tokens.

## Fonctionnalités
- Réponses naturelles via OpenAI dès que le bot est mentionné ou qu'on répond à un de ses messages.
- Personas multiples par serveur : création, activation et liste via commandes slash.
- Commandes administrateur pour vider le contexte d'un salon, afficher un tableau de bord d'usage et gérer les personas.
- Changement du modèle OpenAI restreint au propriétaire (ID `800004332971229184`).
- Support des images jointes transmises à l'API OpenAI.
- Toutes les réponses sont envoyées via des embeds Discord.

## Prérequis
- Node.js 18+ et npm installés.
- Un bot Discord créé avec les intents `Guilds`, `GuildMessages` et `Message Content` activés.
- Une clé API OpenAI valide.

## Configuration
1. Copier le fichier `.env.example` vers `.env` et renseigner les variables :
   ```bash
   DISCORD_TOKEN=...      # Token du bot Discord
   DISCORD_CLIENT_ID=...  # ID de l'application/bot
   OPENAI_API_KEY=...     # Clé API OpenAI
   ```
2. Installer les dépendances :
   ```bash
   npm install
   ```
3. Lancer le bot :
   ```bash
   npm start
   ```

Au premier lancement, les commandes slash sont synchronisées globalement. Les personas et usages sont stockés dans `data/persona-data.json`.

## Commandes Slash
- `/help` : afficher l'aide.
- `/personas` : liste des personas (admin requis).
- `/persona create nom description` : créer une persona (admin requis).
- `/persona set nom` : activer une persona (admin requis).
- `/clearcontext` : vider le contexte du salon (admin requis).
- `/dashboard` : afficher le compteur de tokens et le coût estimé (admin requis).
- `/model set nom` : changer le modèle OpenAI parmi ceux autorisés (propriétaire uniquement).

## Notes sur le contexte
- Le bot conserve un historique limité (15 messages) par salon pour maîtriser les coûts de tokens.
- La persona par défaut reste "Kudachat" (assistante francophone, polie et concise) mais peut être remplacée par les administrateurs du serveur.
