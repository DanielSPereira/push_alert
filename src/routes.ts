import { Router } from "express";
import { WebhookClient, MessageEmbed } from "discord.js";
import { IWebhookData } from './types'

const routes = Router();

routes.post("/", async (req, res) => {
  try {
    const {
      push: { changes },
      actor,
      repository,
    } = req.body;

    const webhookData: IWebhookData = {
      id: process.env.DISCORD_WH_ID!,
      token: process.env.DISCORD_WH_TOKEN!
    };
    
    const webhookClient = new WebhookClient(webhookData);

    const embed = new MessageEmbed()
      .setTitle("Último Commit")
      .setColor("#0099ff")
      .setAuthor({
        name: actor.display_name,
        url: actor.links.self.href,
        iconURL: actor.links.avatar.href,
      }).
      addFields([
        {
          name: "Projeto:",
          value: repository.name.charAt(0).toUpperCase() + repository.name.slice(1),
        },
        { name: changes[0].new.type.charAt(0).toUpperCase() +  changes[0].new.type.slice(1) + ':', value: changes[0].new.name },
        { name: "Mensagem do Commit:", value: changes[0].new.target.message },
      ]);

    await webhookClient.send({
      username: "Push Alert",
      avatarURL: "https://media-exp1.licdn.com/dms/image/C4E0BAQENBxiL194C7A/company-logo_200_200/0/1641776914022?e=1655337600&v=beta&t=cyKrQWiWdIL9FGlBImQ-oWyEMSsuKY9JtbRwjVMP0NQ",
      embeds: [embed],
    });

    res.json({ success: true, statusCode: 201 }).status(201);
  } catch (e){
      console.log('deu erro', e)
    res.json({ success: false, statusCode: 400 }).status(400);
  }
});

export { routes };
