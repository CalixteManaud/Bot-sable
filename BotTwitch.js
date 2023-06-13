const Discord = require('discord.js');
const client = new Discord.Client({ intents: 3276799 });
const config = require('./config.js');
const axios = require('axios');

const targetGuildId = config.IDServeur;
const targetChannelId = config.IDChannel;

client.on('ready', () => {
    console.log(`Connecté en tant que ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.guild.id === targetGuildId && message.channel.id === targetChannelId) {
        let hasImage = false;

        if (message.attachments.size > 0) {
            hasImage = true;
        } else if (message.content) {
            const urlRegex = /(https?:\/\/\S+)/g;
            const urls = message.content.match(urlRegex);

            if (urls) {
                for (const url of urls) {
                    if (await isImageUrl(url)) {
                        hasImage = true;
                        break;
                    }
                }
            }
        }

        if (hasImage) {
            const attachment = message.attachments.first();
            const url = attachment ? attachment.url : message.content;

            try {
                const response = await axios.get('https://api.sightengine.com/1.0/check-workflow.json', {
                    params: {
                        'url': url,
                        'workflow': config.work,
                        'api_user': config.apiUser,
                        'api_secret': config.apiSecret,
                    }
                });

                if (response.data.summary.action === 'reject'){
                    message.delete().catch(console.error);
                    console.log(`Message supprimé : ${message.content}`);
                }

                // Faites ici ce que vous voulez faire avec la réponse de l'API Sightengine

            } catch (error) {
                if (error.response) console.log(error.response.data);
                else console.log(error.message);
            }
        }
    }
});

async function isImageUrl(url) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const urlLower = url.toLowerCase();

    return imageExtensions.some(extension => urlLower.endsWith(extension));
}

client.login(config.token);