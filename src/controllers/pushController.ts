import { WebhookClient, MessageEmbed } from "discord.js";
import { getIdAndToken } from "../helpers/getIdAndToken";
import { IRequest, IResponse } from "../types/http";

import dicordChannels from "../db/discordChannelWebhooks";

export default {
  notifyPush: async (req: IRequest, res: IResponse) => {
    try {
      const discordChannelId = req.params.id;
      const channel = dicordChannels.find(
        (channel) => channel.id == Number(discordChannelId)
      );

      if (!channel) throw new Error("Canal do discord não cadastrado!");

      const [id, token] = getIdAndToken(channel.URL);

      const {
        push: { changes },
        repository: { name },
        actor: { links, display_name },
      } = req.body;

      const webhookClient = new WebhookClient({ id, token });

      const embed = new MessageEmbed()
        .setTitle("Último Commit")
        .setColor("#0099ff")
        .setAuthor({
          name: display_name,
          url: links.self.href,
          iconURL: links.avatar.href,
        })
        .addFields([
          {
            name: "Projeto:",
            value: name.charAt(0).toUpperCase() + name.slice(1),
          },
          {
            name:
              changes[0].new.type.charAt(0).toUpperCase() +
              changes[0].new.type.slice(1) +
              ":",
            value: changes[0].new.name,
          },
          { name: "Mensagem do Commit:", value: changes[0].new.target.message },
        ]);

      await webhookClient.send({
        username: "Push Alert",
        avatarURL:
          "https://media-exp1.licdn.com/dms/image/C4E0BAQENBxiL194C7A/company-logo_200_200/0/1641776914022?e=1655337600&v=beta&t=cyKrQWiWdIL9FGlBImQ-oWyEMSsuKY9JtbRwjVMP0NQ",
        embeds: [embed],
      });

      return res
        .json({ success: true, message: "Notificação realizado com sucesso!" })
        .status(200);
    } catch (e: any) {
      console.log("deu erro", e);
      return res.json({ success: false, message: e.message }).status(401);
    }
  },
};
