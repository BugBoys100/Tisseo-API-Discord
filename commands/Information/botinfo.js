const Discord = require("discord.js");
const {MessageEmbed} = require("discord.js");
const config = require("../../botconfig/config.json");
var ee = require("../../botconfig/embed.json");
module.exports = {
  name: "botinfo", //the command name for execution & for helpcmd [OPTIONAL]
  category: "Information", //the command category for helpcmd [OPTIONAL]
  aliases: ["binfo", "bot"], //the command aliases for helpcmd [OPTIONAL]
  cooldown: 5, //the command cooldown for execution & for helpcmd [OPTIONAL]
  usage: "botinfo", //the command usage for helpcmd [OPTIONAL]
  description: "Donne les infos du bot", //the command description for helpcmd [OPTIONAL]
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  minargs: 0, // minimum args for the message, 0 == none [OPTIONAL]
  maxargs: 0, // maximum args for the message, 0 == none [OPTIONAL]
  minplusargs: 0, // minimum args for the message, splitted with "++" , 0 == none [OPTIONAL]
  maxplusargs: 0, // maximum args for the message, splitted with "++" , 0 == none [OPTIONAL]
  argsmissing_message: "", //Message if the user has not enough args / not enough plus args, which will be sent, leave emtpy / dont add, if you wanna use command.usage or the default message! [OPTIONAL]
  argstoomany_message: "", //Message if the user has too many / not enough args / too many plus args, which will be sent, leave emtpy / dont add, if you wanna use command.usage or the default message! [OPTIONAL]
  run: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
    try {   
      try{
        //create the EMBED
        const embeduserinfo = new MessageEmbed()
        embeduserinfo.setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 512 }))
        embeduserinfo.setAuthor("Information sur le bot :   " + client.user.username + "#" + client.user.discriminator, client.user.displayAvatarURL({ dynamic: true }))
        embeduserinfo.addField('**❱ Nom d\'utilisateur :**',`<@${client.user.id}>\n\`${client.user.tag}\``,true)
        embeduserinfo.addField('**❱ ID :**',`\`${client.user.id}\``,true)
        embeduserinfo.addField('**❱ Avatar :**',`[\`Lien de l'avatar\`](${client.user.displayAvatarURL({ format: "png" })})`,true)
        embeduserinfo.addField('**❱ Language :**',`\`Javascript\``,true)
        embeduserinfo.addField('**❱ Développeur :**',`[\`Bug Boys#9702\`](https://bugboys.xyz/)`,true)
        embeduserinfo.addField('**❱ Source du bot :**',`[\`Github de la source\`](https://github.com/Tomato6966/Discord-Js-Handler-Template)`,true)
        embeduserinfo.setColor(ee.color)
        embeduserinfo.setFooter(ee.footertext, ee.footericon)
        //send the EMBED
        message.reply({embeds: [embeduserinfo]})
      }catch (e){
        console.log(e)

        embeduserinfo.setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 512 }))
        embeduserinfo.setAuthor("Information sur le bot :   " + client.user.username + "#" + client.user.discriminator, client.user.displayAvatarURL({ dynamic: true }))
        embeduserinfo.addField('**❱ Nom d\'utilisateur :**',`<@${client.user.id}>\n\`${client.user.tag}\``,true)
        embeduserinfo.addField('**❱ ID :**',`\`${client.user.id}\``,true)
        embeduserinfo.addField('**❱ Avatar :**',`[\`Lien de l'avatar\`](${client.user.displayAvatarURL({ format: "png" })})`,true)
        embeduserinfo.addField('**❱ Language :**',`\`Javascript\``,true)
        embeduserinfo.addField('**❱ Développeur :**',`[\`Bug Boys#9702\`](https://bugboys.xyz/)`,true)
        embeduserinfo.addField('**❱ Source du bot :**',`[\`Github de la source\`](https://github.com/Tomato6966/Discord-Js-Handler-Template)`,true)
        embeduserinfo.setColor(ee.color)
        embeduserinfo.setFooter(ee.footertext, ee.footericon)     
        //send the EMBED
        message.reply({embeds: [embeduserinfo]})
      }
      
    } catch (e) {
      console.log(String(e.stack).bgRed)
      return message.reply({embeds: [new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`❌ ERREUR | Une erreur est apparue`)
          .setDescription(`\`\`\`${e.message ? String(e.message).substr(0, 2000) : String(e).substr(0, 2000)}\`\`\``)
      ]});
    }
  }
}
