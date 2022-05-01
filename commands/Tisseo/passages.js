const {
  MessageEmbed
} = require("discord.js");
const request = require('request');
const config = require("../../botconfig/config.json");
var ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const arret_json = require("../../json/stop_areas.json")
const lignes_json = require("../../json/lines.json")


function date(today) {
  const epoque = new Date(today)
  var dd = String(epoque.getDate()).padStart(2, '0');
  var mm = String(epoque.getMonth() + 1).padStart(2, '0');
  var yyyy = epoque.getFullYear();
  var hh = today.slice(11,16)
  retour = '\n -  le ' + dd + '/' + mm + '/' + yyyy + ' à ' + hh  + '\n';
  
  return retour 
}

function search_id_stop(nom, arret_json){
  var base_json = arret_json['stopAreas']['stopArea']
      for (var indice = 0; indice < base_json.length; indice++){
          if(String(base_json[indice]['name']) === String(nom)){
              return base_json[indice]['id']
            }
      }
      return false
}

function search_id_line(numero, lignes_json) {
  var base_json = lignes_json['lines']['line']
  for (var indice = 0; indice < base_json.length; indice++){
      if(String(base_json[indice]['shortName']) === String(numero)){
          return base_json[indice]['id']
      }
  }
  return false
}

module.exports = {
  name: "passages", //the command name for execution & for helpcmd [OPTIONAL]
  category: "Tisseo", //the command category for helpcmd [OPTIONAL]
  aliases: ["passage", "psg"], //the command aliases for helpcmd [OPTIONAL]
  cooldown: 15, //the command cooldown for execution & for helpcmd [OPTIONAL]
  usage: "passage [nom de l'arrêt] ++ [n° de ligne]", //the command usage for helpcmd [OPTIONAL]
  description: "Envoie des infos tisseo", //the command description for helpcmd [OPTIONAL]
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: settings.ownerIDS, //Only allow specific Users to execute a Command [OPTIONAL]
  minargs: 0, // minimum args for the message, 0 == none [OPTIONAL]
  maxargs: 0, // maximum args for the message, 0 == none [OPTIONAL]
  minplusargs: 2, // minimum args for the message, splitted with "++" , 0 == none [OPTIONAL]
  maxplusargs: 2, // maximum args for the message, splitted with "++" , 0 == none [OPTIONAL]
  argsmissing_message: "Arguments insuffisants", //Message if the user has not enough args / not enough plus args, which will be sent, leave emtpy / dont add, if you wanna use command.usage or the default message! [OPTIONAL]
  argstoomany_message: "", //Message if the user has too many / not enough args / too many plus args, which will be sent, leave emtpy / dont add, if you wanna use command.usage or the default message! [OPTIONAL]
  run: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
    try {
      

      const nom_arret = plusArgs[0].slice(0,plusArgs[0].length-1)
      const ligne = plusArgs[1].slice(1,3)


      const stopPointId = search_id_stop(nom_arret, arret_json)
      const lineId = search_id_line(ligne, lignes_json)

      if (!stopPointId || !lineId) {
        return message.reply('Ligne / Arrêt inconnue')
      }

      const lien = `https://api.tisseo.fr/v1/stops_schedules.json?stopPointId=${stopPointId}&lineId=${lineId}&key=${settings.tisseo_key}`

      let options = {json: true};
      request(lien, options, (error, res, body) => {
          if (error) {
              return  console.log(error)
          };

          if (!error && res.statusCode == 200) {
            var destinations = []
            var resultat = {}
            for (var i=0; i < body['departures']["departure"].length;i++) {
              const body_correct = body['departures']['departure'][i]
              
              /////////////////////////////////////////////////////////
              // SI IL N'Y A PAS DANS LE DISCTIONNAIRE "DESTINATION" //
              /////////////////////////////////////////////////////////
              if (!destinations.find(elt => elt == String(body_correct['destination'][0]['name']))){
                  resultat[body_correct['destination'][0]['name']] = date(body_correct['dateTime'])
                  destinations.push(body_correct['destination'][0]['name'])
              }
              ////////////////////////////////////
              // SI IL Y A DANS LE DICTIONNAIRE //
              ////////////////////////////////////
              else if (destinations.find(elt => elt == String(body_correct['destination'][0]['name']))){
                  resultat[body_correct['destination'][0]['name']] = resultat[body_correct['destination'][0]['name']] + date(body_correct['dateTime'])
              }
            }

            const embed = new MessageEmbed()
            embed.setColor(ee.color)
            embed.setFooter(String(ee.footertext), client.user.displayAvatarURL())
            embed.setTitle(`Prochains passages pour la ligne ${args[1]} à l'arrêt ${args[0]}`)
            for (const [key, value] of Object.entries(resultat)) {
              embed.addField(key, value)
            }
            message.reply({embeds: [embed]})
          }
        })
      


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