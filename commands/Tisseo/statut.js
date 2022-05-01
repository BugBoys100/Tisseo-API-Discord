const {
    MessageEmbed
} = require("discord.js");
const fetch = require('node-fetch')
const config = require("../../botconfig/config.json");
var ee = require("../../botconfig/embed.json");
const arret_json = require("../../json/stop_areas.json")
const settings = require("../../botconfig/settings.json");
const lignes = require('../../json/lines.json')
const request = require('request')


// Renew les json :
// Arrêts :
// https://api.tisseo.fr/v1/stop_areas.json?network=tisseo&key= KEY

// Lignes :
// https://api.tisseo.fr/v1/lines.json?key= KEY


function date(today) {
    const epoque = new Date(today)
    var dd = String(epoque.getDate()).padStart(2, '0');
    var mm = String(epoque.getMonth() + 1).padStart(2, '0');
    var yyyy = epoque.getFullYear();
    var hh = today.slice(11,16)
    retour = '\n -  le ' + dd + '/' + mm + '/' + yyyy + ' à ' + hh  + '\n';
    
    return retour 
  }

module.exports = {
    name: "statut", //the command name for execution & for helpcmd [OPTIONAL]
    category: "Tisseo", //the command category for helpcmd [OPTIONAL]
    aliases: [], //the command aliases for helpcmd [OPTIONAL]
    cooldown: 5, //the command cooldown for execution & for helpcmd [OPTIONAL]
    usage: "statut", //the command usage for helpcmd [OPTIONAL]
    description: "Envoie des infos sur l'API Tisséo", //the command description for helpcmd [OPTIONAL]
    memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    minargs: 0, // minimum args for the message, 0 == none [OPTIONAL]
    maxargs: 0, // maximum args for the message, 0 == none [OPTIONAL]
    minplusargs: 0, // minimum args for the message, splitted with "++" , 0 == none [OPTIONAL]
    maxplusargs: 0, // maximum args for the message, splitted with "++" , 0 == none [OPTIONAL]
    argsmissing_message: "Arguments insuffisants", //Message if the user has not enough args / not enough plus args, which will be sent, leave emtpy / dont add, if you wanna use command.usage or the default message! [OPTIONAL]
    argstoomany_message: "", //Message if the user has too many / not enough args / too many plus args, which will be sent, leave emtpy / dont add, if you wanna use command.usage or the default message! [OPTIONAL]
    run: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
        try {

            const lien = `https://api.tisseo.fr/v1/&key=${settings.tisseo_key}`
            let options_json = { json: true };
            request(lien, options_json, (error, res, body) => {
                var retour_embed = new MessageEmbed()
                if (error) {
                    return console.log(error)
                };
                if (body['message']){
                    retour_embed.addField('Statut de l\'API :', 'En ligne', true)
                } else {
                    retour_embed.addField('Statut de l\'API :', 'Hors ligne', true)
                }
                retour_embed.addField('Expirations des fichiers JSON :', `Lignes : ${date(lignes['expirationDate'])}\nArrêts : ${date(arret_json["expirationDate"])}`)

                retour_embed.addField('Nombre d\'arrêts :', String(arret_json['stopAreas']['stopArea'].length))
                retour_embed.addField('Nombre de lignes :', String(lignes['lines']['line'].length))

                return message.reply({embeds:[retour_embed]})
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