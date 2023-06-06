const Discord = require("discord.js");
const readline = require('readline');
const client = new Discord.Client({intents: 3276799});
const config = require('./config.js');

const targetGuildId = '1054353567206604850';
const targetChannelId = '1054353568188080220';
const targetEmojis = ['🦴', '🍌', '🎫', '🔋', '📰', '🚬'];

client.on('ready', async() => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.message.guild.id === targetGuildId && reaction.message.channel.id === targetChannelId) {
        if (targetEmojis.includes(reaction.emoji.name)) {
            console.log(`Emoji réagi dans le salon spécifié : ${reaction.emoji.name}`);

            // Ajouter une réaction supplémentaire au message
            try {
                await reaction.message.react(reaction.emoji.name);
                console.log(`Bot a réagi avec : ${reaction.emoji.name}`);
            } catch (error) {
                console.error('Erreur lors de la réaction avec le bot :', error);
            }
        }
    }
});

client.login(config.token);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Écouter les entrées du clavier
rl.on('line', (input) => {
    if (input.toLowerCase() === 'q') {
        console.log('Déconnexion du bot...');
        client.destroy();
        rl.close();
    }
});