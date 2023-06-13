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
                    if (isImageUrl(url)) {
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
                        'workflow': 'wfl_edZJCSSIo1nRmhugC1P76',
                        'api_user': '122218943',
                        'api_secret': '7hX32MyuZsqBC3AP9WBQ',
                    }
                });

                console.log(response.data);
                // Faites ici ce que vous voulez faire avec la réponse de l'API Sightengine

            } catch (error) {
                if (error.response) console.log(error.response.data);
                else console.log(error.message);
            }
        } else {
            console.log("Pas d'image");
        }
    }
});

function isImageUrl(url) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const urlLower = url.toLowerCase();

    return imageExtensions.some(extension => urlLower.endsWith(extension));
}


async function detectExplicitContent(imageUrl) {
    try {
        const response = await axios.get('https://api.sightengine.com/1.0/check.json', {
            params: {
                'url': imageUrl,
                'workflow': 'wfl_ee1GlKYsAC3bRRNI4P4nR',
                'api_user': '122218943',
                'api_secret': '7hX32MyuZsqBC3AP9WBQ',
            },
        }).then(function (response) {
            // on success: handle response
            console.log(response.data);
        })
            .catch(function (error) {
                // handle error
                if (error.response) console.log(error.response.data);
                else console.log(error.message);
            });

    } catch (error) {
        console.error(error);
        return false;
    }
}

client.login(config.token);