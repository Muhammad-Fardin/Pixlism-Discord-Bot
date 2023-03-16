// MTA4NTU5NDMxNDE1Mjg5MDUyOA.GaR3Pg.iSEsMToZqYY8TgBRrIaUjUgDI8P-UKneYCfAdk

const { Configuration, OpenAIApi } = require("openai");
const { Client, GatewayIntentBits , EmbedBuilder} = require("discord.js");
const dotenv = require("dotenv");
dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.APIKEY,
});

const openai = new OpenAIApi(configuration);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// client.on("messageCreate", (message) => {
//   if (message.author.bot) return;
//   message.reply({
//     content: "Hi Mate",
//   });
//   console.log("working");
// });

client.on("interactionCreate", async (interaction) => {
  await interaction.deferReply()
  try {

    const prompt = interaction.options.getString("prompt");
    const aiResponse = await openai.createImage({
      prompt,
      n: 1,
      size: "1024x1024",
    });
    const image = aiResponse.data.data[0].url;
    const embed = new EmbedBuilder().setTitle(prompt).setImage(image);
    await interaction.editReply({embeds: [embed]});
  } catch (error) {
    console.log(error)
    if(error.response.status == 400) return await interaction.editReply({content: "Cannot Generate Right Now, Try within a few minutes."})
    return await interaction.editReply({content: `Request Failed with Status Code ${error.response.status}`})
  }
});

client.login(process.env.TOKEN);



