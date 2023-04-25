const { Client } = require('discord.js');
const Discord = require('discord.js');
const mongoose = require('mongoose');
const ConfigModel = require('./configModel');

const client = new Client();
client.login('ODM4ODk0NjY4OTA4NTkzMTgz.GZ91TW.W5YYp135Y8ZHklMupjF9-K-lK4g_PMGE3r2fyY');

mongoose.connect('mongodb+srv://iciy89746:<R6jiwyzZLTnEMV1F>@avatar.pl5jtqs.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});

client.on('ready', async () => {
  client.user.setActivity('with MongoDB');
  console.log(`${client.user.username} ready!`);
});

client.on('messageCreate', async message => {
  if (!message.guild) return;
  const guildConfig = await ConfigModel.findOne({ guildID: message.guild.id }).exec();
  if (!guildConfig) return;

  const channelConfig = guildConfig.channels.get(message.channelId);
  if (!channelConfig) return;

  const images = message.attachments.filter(d => d.contentType.startsWith("image/"));
  if (images.size === 0) return;

  const webhook = new Discord.WebhookClient({
    url: channelConfig.url
  });

  const line = guildConfig.lineURL ? new Discord.MessageAttachment(guildConfig.lineURL) : null;

  await Promise.all(await images.map(async d => {
    const embed = new Discord.MessageEmbed()
      .setImage(d.url)
      .setColor('#2F3136');

    await webhook.send({ embeds: [embed] }).then(async () => {
      if (line) {
        await webhook.send({ files: [line] }).catch((err) => null);
      }
    }).catch((err) => null);
  }));

  webhook.destroy();
});

