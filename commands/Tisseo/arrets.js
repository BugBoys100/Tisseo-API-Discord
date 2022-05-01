const {
    MessageEmbed
  } = require("discord.js");
  const fetch = require('node-fetch')
  const config = require("../../botconfig/config.json");
  var ee = require("../../botconfig/embed.json");
  const arret_json = require("../../json/stop_areas.json")
  const settings = require("../../botconfig/settings.json");
  
  const search_array = (liste, item) => {
    !!liste.find((el) => el == item)
   };
  
  
  function date (today) {
    const epoque = new Date(today)
    var dd = String(epoque.getDate()).padStart(2, '0');
    var mm = String(epoque.getMonth() + 1).padStart(2, '0');
    var yyyy = epoque.getFullYear();
    var hh = today.slice(11,16)
    retour = '\n -  le ' + dd + '/' + mm + '/' + yyyy + ' à ' + hh  + '\n';
    
    return retour 
  }
  
  
  
  module.exports = {
    name: "arrets", //the command name for execution & for helpcmd [OPTIONAL]
    category: "Tisseo", //the command category for helpcmd [OPTIONAL]
    aliases: ["arret", "art", "arrêt"], //the command aliases for helpcmd [OPTIONAL]
    cooldown: 5, //the command cooldown for execution & for helpcmd [OPTIONAL]
    usage: "arret [nom de l'arrêt]", //the command usage for helpcmd [OPTIONAL]
    description: "Envoie des infos sur une ligne Tisséo", //the command description for helpcmd [OPTIONAL]
    memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: settings.ownerIDS, //Only allow specific Users to execute a Command [OPTIONAL]
    minargs: 1, // minimum args for the message, 0 == none [OPTIONAL]
    maxargs: 10, // maximum args for the message, 0 == none [OPTIONAL]
    minplusargs: 0, // minimum args for the message, splitted with "++" , 0 == none [OPTIONAL]
    maxplusargs: 0, // maximum args for the message, splitted with "++" , 0 == none [OPTIONAL]
    argsmissing_message: "Arguments insuffisants", //Message if the user has not enough args / not enough plus args, which will be sent, leave emtpy / dont add, if you wanna use command.usage or the default message! [OPTIONAL]
    argstoomany_message: "", //Message if the user has too many / not enough args / too many plus args, which will be sent, leave emtpy / dont add, if you wanna use command.usage or the default message! [OPTIONAL]
    run: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
      try { 
        // https://api.tisseo.fr/v1/stop_areas.json?network=tisseo&key= KEY
        var base_json = arret_json['stopAreas']['stopArea']
        console.log(base_json.length)
        console.log('|'+args+'|')
            for (var indice = 0; indice < base_json.length; indice++){
                if(String(base_json[indice]['name']) === String(args)){
                    var destination_str = ''
                    for (var indice_json = 0; indice_json<base_json[indice]['line'].length;indice_json++){
                        var destination_str = destination_str + '\n' + base_json[indice]['line'][indice_json]['shortName'] + ' | ' + base_json[indice]['line'][indice_json]['name']
                    }
                    var ligne_detail = {'Nom de l\'arrêt':base_json[indice]['name'], 'ID de l\'arrêt' : base_json[indice]['id'], 'Destinations' : destination_str}
                    // var ligne_detail = {'N° de ligne':base_json[indice]['name'], 'ID' : base_json[indice][''], 'Direction' : base_json[indice]['name'], 'Couleur' : base_json[indice]['bgXmlColor']}
                    //         N° DE LA LIGNE, ID , NOM , COULEUR
                    messa = new MessageEmbed()
                    messa.setColor(ee.color)
                    for (const [key, value] of Object.entries(ligne_detail)) {
                        messa.addField(key, value)
                      }
                    
                    return message.reply({embeds: [messa]})
                }
            }
            return message.reply('Arrêt inexistant')
  
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