const Discord = require('discord.js');
const client = new Discord.Client({ intents: 3276799 });
const config = require('./config.js');
const axios = require('axios');
const targetGuildId = '1117919355519385670';
const targetChannelId = '1117938915731570728';
client.on('ready', () => {
    console.log(`Connecté en tant que ${client.user.tag}`);
});

client.on('message', async (message) => {
    if (message.guild.id === targetGuildId && message.channel.id === targetChannelId) {
        if (message.attachments.size > 0) {
            const attachment = message.attachments.first();
            const imageUrl = attachment.url;

            const explicit = await detectExplicitContent(imageUrl);

            if (explicit) {
                message.delete()
                    .then(() => console.log(`Message contenant une image explicite supprimé.`))
                    .catch(console.error);
            }
        }
    }
});
async function detectExplicitContent(imageUrl) {
    try {
        const response = await axios.get('https://api.sightengine.com/1.0/check.json', {
            params: {
                url: imageUrl,
                models: 'nudity-2.0,wad,offensive,scam,text-content,face-attributes,gore,text,qr-content,tobacco',
                api_user: config.apiUser,
                api_secret: config.apiSecret,
            },
        });

        const data = response.data;

        const explicitModels = ['nudity', 'wad', 'offensive', 'scam', 'gore', 'text', 'qr-content', 'tobacco'];
        for (const model of explicitModels) {
            if (data[model].match === true) {
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error(error);
        return false;
    }
}

client.login(config.token)
    .then(() => console.log(`Connecté au compte ${client.user.tag}`))
    .catch(console.error);