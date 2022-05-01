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


module.exports = {
    name: "statut", //the command name for the Slash Command
    description: "Donne le statut de l'API Tisséo", //the command description for Slash Command Overview
    cooldown: 1,
    memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!	
        //INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ] 
        //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
        //{"String": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getString("ping_amount")
        // { "String": { name: "arrêt", description: "Arrêt souhaité", required: true } }, //to use in the code: interacton.getUser("ping_a_user")
        //{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
        //{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
        // {"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
        { "StringChoices": { name: "quel_statut", description: "Quel statut tu veux savoir ?", required: false, choices: [["Ligne", "ligne"], ["Arrêt", "arret"]] } }, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
    ],
    run: async (client, interaction) => {
        try {

            const { member, channelId, guildId, applicationId,
                commandName, deferred, replied, ephemeral,
                options, id, createdTimestamp
            } = interaction;
            const { guild } = member;
            const choix = options.getString('quel_statut')

            if (choix) {
                if (choix === 'ligne') {
                    var retour_embed = new MessageEmbed()

                    retour_embed.addField('Expirations des fichiers JSON des lignes :', `${date(lignes_json['expirationDate'])}`)

                    retour_embed.addField('Nombre de lignes :', String(lignes_json['lines']['line'].length))

                    return interaction.reply({ embeds: [retour_embed], ephemeral: true })
                }
                else if (choix === 'arret') {
                    var retour_embed = new MessageEmbed()

                    retour_embed.addField('Expirations des fichiers JSON des arrêts :', `${date(arret_json['expirationDate'])}`)

                    retour_embed.addField('Nombre d\'arrêt :', String(arret_json['stopAreas']['stopArea'].length))

                    return interaction.reply({ embeds: [retour_embed], ephemeral: true })
                }
            }
            else {
                const lien = `https://api.tisseo.fr/v1/&key=${settings.tisseo_key}`
                let options_json = { json: true };
                request(lien, options_json, (error, res, body) => {
                    var retour_embed = new MessageEmbed()
                    if (error) {
                        return console.log(error)
                    };
                    if (body['message']) {
                        retour_embed.addField('Statut de l\'API :', 'En ligne', true)
                    } else {
                        retour_embed.addField('Statut de l\'API :', 'Hors ligne', true)
                    }
                    retour_embed.addField('Expirations des fichiers JSON :', `Lignes : ${date(lignes_json['expirationDate'])}\nArrêts : ${date(arret_json["expirationDate"])}`)

                    retour_embed.addField('Nombre d\'arrêts :', String(arret_json['stopAreas']['stopArea'].length))
                    retour_embed.addField('Nombre de lignes :', String(lignes_json['lines']['line'].length))

                    return interaction.reply({ embeds: [retour_embed] })
                })
            }
        } catch (e) {
                console.log(String(e.stack).bgRed)
            }
        }
}