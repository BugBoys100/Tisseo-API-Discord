const Discord = require("discord.js");
const request = require('request');
const { MessageEmbed } = require("discord.js");
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
    var hh = today.slice(11, 16)
    retour = '\n -  le ' + dd + '/' + mm + '/' + yyyy + ' à ' + hh + '\n';

    return retour
}

function search_id_stop(nom, arret_json) {
    var base_json = arret_json['stopAreas']['stopArea']
    for (var indice = 0; indice < base_json.length; indice++) {
        if (String(base_json[indice]['name']) === String(nom)) {
            return base_json[indice]['id']
        }
    }
    return false
}

function search_id_line(numero, lignes_json) {
    var base_json = lignes_json['lines']['line']
    for (var indice = 0; indice < base_json.length; indice++) {
        if (String(base_json[indice]['shortName']) === String(numero)) {
            return base_json[indice]['id']
        }
    }
    return false
}


module.exports = {
    name: "arrêt", //the command name for the Slash Command
    description: "Donne des infos sur un arrêt Tisséo", //the command description for Slash Command Overview
    cooldown: 1,
    memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!	
        //INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ] 
        //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
        //{"String": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getString("ping_amount")
        { "String": { name: "arrêt", description: "Arrêt souhaité", required: true } }, //to use in the code: interacton.getUser("ping_a_user")
        // { "String": { name: "ligne", description: "Ligne de transport", required: true } }, //to use in the code: interacton.getUser("ping_a_user")
        //{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
        //{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
        //{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
        //{"StringChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", "botping"], ["Discord Api", "api"]] }}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
    ],
    run: async (client, interaction) => {
        try {

            const { member, channelId, guildId, applicationId,
                commandName, deferred, replied, ephemeral,
                options, id, createdTimestamp
            } = interaction;
            const { guild } = member;
            const args = options.getString('arrêt')
            //let IntOption = options.getInteger("OPTIONNAME"); //same as in IntChoices
            //const StringOption = options.getString("what_ping"); //same as in StringChoices

            var base_json = arret_json['stopAreas']['stopArea']
            for (var indice = 0; indice < base_json.length; indice++) {
                if (String(base_json[indice]['name']) === String(args)) {
                    var destination_str = ''
                    for (var indice_json = 0; indice_json < base_json[indice]['line'].length; indice_json++) {
                        var destination_str = destination_str + '\n' + base_json[indice]['line'][indice_json]['shortName'] + ' | ' + base_json[indice]['line'][indice_json]['name']
                    }
                    var ligne_detail = { 'Nom de l\'arrêt': base_json[indice]['name'], 'ID de l\'arrêt': base_json[indice]['id'], 'Destinations': destination_str }
                    // var ligne_detail = {'N° de ligne':base_json[indice]['name'], 'ID' : base_json[indice][''], 'Direction' : base_json[indice]['name'], 'Couleur' : base_json[indice]['bgXmlColor']}
                    //         N° DE LA LIGNE, ID , NOM , COULEUR
                    messa = new MessageEmbed()
                    messa.setColor(ee.color)
                    for (const [key, value] of Object.entries(ligne_detail)) {
                        messa.addField(key, value)
                    }

                    return interaction.reply({ embeds: [messa] })
                }
            }
            return interaction.reply('Arrêt inexistant')


        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}