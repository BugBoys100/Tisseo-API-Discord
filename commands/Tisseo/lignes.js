const {
    MessageEmbed
  } = require("discord.js");
  const fetch = require('node-fetch')
  const config = require("../../botconfig/config.json");
  var ee = require("../../botconfig/embed.json");
  const lignes_json = require("../../json/lines.json")
  const settings = require("../../botconfig/settings.json");
  
  
  module.exports = {
    name: "lignes", //the command name for execution & for helpcmd [OPTIONAL]
    category: "Tisseo", //the command category for helpcmd [OPTIONAL]
    aliases: ["ligne"], //the command aliases for helpcmd [OPTIONAL]
    cooldown: 5, //the command cooldown for execution & for helpcmd [OPTIONAL]
    usage: "ligne [n° de ligne]", //the command usage for helpcmd [OPTIONAL]
    description: "Envoie des infos sur une ligne Tisséo", //the command description for helpcmd [OPTIONAL]
    memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: settings.ownerIDS, //Only allow specific Users to execute a Command [OPTIONAL]
    minargs: 1, // minimum args for the message, 0 == none [OPTIONAL]
    maxargs: 1, // maximum args for the message, 0 == none [OPTIONAL]
    minplusargs: 0, // minimum args for the message, splitted with "++" , 0 == none [OPTIONAL]
    maxplusargs: 0, // maximum args for the message, splitted with "++" , 0 == none [OPTIONAL]
    argsmissing_message: "Arguments insuffisants", //Message if the user has not enough args / not enough plus args, which will be sent, leave emtpy / dont add, if you wanna use command.usage or the default message! [OPTIONAL]
    argstoomany_message: "", //Message if the user has too many / not enough args / too many plus args, which will be sent, leave emtpy / dont add, if you wanna use command.usage or the default message! [OPTIONAL]
    run: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
      try {
        var base_json = lignes_json['lines']['line']
            for (var indice = 0; indice < base_json.length; indice++){
                if(String(base_json[indice]['shortName']) === String(args)){
                    var ligne_detail = {'N° de ligne':base_json[indice]['shortName'], 'ID' : base_json[indice]['id'], 'Direction' : base_json[indice]['name'], 'Couleur' : base_json[indice]['bgXmlColor']}
                    //         N° DE LA LIGNE, ID , NOM , COULEUR
                    messa = new MessageEmbed()
                    messa.setColor(ligne_detail['Couleur'])
                    for (const [key, value] of Object.entries(ligne_detail)) {
                        messa.addField(key, value)
                      }
                    
                    return message.reply({embeds: [messa]})
                }
            }
            return message.reply('Ligne inconnue')
  
      } catch (e) {
        console.log(String(e.stack).bgRed)
        return message.reply({
          embeds: [new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`❌ ERREUR | Une erreur est apparue`)
            .setDescription(`\`\`\`${e.message ? String(e.message).substr(0, 2000) : String(e).substr(0, 2000)}\`\`\``)
          ]
        });
      }
    }
  }