(async() => {
    // * default imports
    const events = require('events');
    const {
        exec
    } = require("child_process")
    const logs = require("discord-logs")
    const Discord = require("discord.js")
    const {
        MessageEmbed,
        MessageButton,
        MessageActionRow,
        Intents,
        Permissions,
        MessageSelectMenu
    } = require("discord.js")
    const fs = require('fs');
    let process = require('process');
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // * block imports
    let URL = require('url')
    const ms = require("ms")
    let https = require("https")
    const S4D_APP_NOBLOX = require("noblox.js");
    const synchronizeSlashCommands = require('@frostzzone/discord-sync-commands');

    // * define s4d components (pretty sure 90% of these arnt even used/required)
    let s4d = {
        Discord,
        fire: null,
        joiningMember: null,
        reply: null,
        player: null,
        manager: null,
        Inviter: null,
        message: null,
        notifer: null,
        checkMessageExists() {
            if (!s4d.client) throw new Error('You cannot perform message operations without a Discord.js client')
            if (!s4d.client.readyTimestamp) throw new Error('You cannot perform message operations while the bot is not connected to the Discord API')
        }
    };

    // * check if d.js is v13
    if (!require('./package.json').dependencies['discord.js'].startsWith("^13.")) {
        let file = JSON.parse(fs.readFileSync('package.json'))
        file.dependencies['discord.js'] = '^13.16.0'
        fs.writeFileSync('package.json', JSON.stringify(file, null, 4))
        exec('npm i')
        throw new Error("Seems you arent using v13 please re-run or run `npm i discord.js@13.16.0`");
    }

    // * check if discord-logs is v2
    if (!require('./package.json').dependencies['discord-logs'].startsWith("^2.")) {
        let file = JSON.parse(fs.readFileSync('package.json'))
        file.dependencies['discord-logs'] = '^2.0.0'
        fs.writeFileSync('package.json', JSON.stringify(file, null, 4))
        exec('npm i')
        throw new Error("discord-logs must be 2.0.0. please re-run or if that fails run `npm i discord-logs@2.0.0` then re-run");
    }

    // * create a new discord client
    s4d.client = new s4d.Discord.Client({
        intents: [
            Object.values(s4d.Discord.Intents.FLAGS).reduce((acc, p) => acc | p, 0)
        ],
        partials: [
            "REACTION",
            "CHANNEL"
        ]
    });

    // * when the bot is connected say so
    s4d.client.on('ready', () => {
        console.log(s4d.client.user.tag + " is alive!")
    })

    // * upon error print "Error!" and the error
    process.on('uncaughtException', function(err) {
        console.log('Error!');
        console.log(err);
    });

    // * give the new client to discord-logs
    logs(s4d.client);

    // * pre blockly code


    // * blockly code
    await s4d.client.login('MTE3MTA2MTY4MTc1ODE1MDcyNw.GMoRB8.LLSSblm5m-jF4Zxbm8ZbIXZcmspuAl-q_FpE7A').catch((e) => {
        const tokenInvalid = true;
        const tokenError = e;
        if (e.toString().toLowerCase().includes("token")) {
            throw new Error("An invalid bot token was provided!")
        } else {
            throw new Error("Privileged Gateway Intents are not enabled! Please go to https://discord.com/developers and turn on all of them.")
        }
    });

    synchronizeSlashCommands(s4d.client, [{
        name: 'verify',
        description: 'Verify yourself with Roblox.',
        options: [{
            type: 3,
            name: 'username',
            required: true,
            description: '',
            choices: [

            ]
        }, ]
    }, ], {
        debug: false,
    });

    s4d.client.on('guildMemberAdd', async(param1) => {
        s4d.joiningMember = param1;
        var Welcome = new Discord.MessageEmbed();
        Welcome.setColor('#666600');
        Welcome.setTitle(String('New Member!'))
        Welcome.setURL(String());
        Welcome.setDescription(String((['Welcome, ', (s4d.joiningmember).nickname == null ? (s4d.joiningmember).user.username : (s4d.joiningmember).nickname, '!', 'Verify by using the /verify command.'].join(''))));
        Welcome.setImage(String(((s4d.joiningMember.user).displayAvatarURL({
            format: "png"
        }))));
        Welcome.setTimestamp(new Date());

        s4d.client.channels.cache.get('1152579398357233776').send({
            embeds: [Welcome]
        });
        s4d.joiningMember = null
    });

    s4d.client.on('interactionCreate', async(interaction) => {
        if ((interaction.commandName) == 'verify') {
            S4D_APP_NOBLOX.getIdFromUsername(String((interaction.options.getString('username')))).then(async(gained_roblox_user_id) => {
                if ((gained_roblox_user_id) != null) {
                    S4D_APP_NOBLOX.getPlayerInfo({
                        userId: Number((gained_roblox_user_id))
                    }).then(async(roblox_user_info) => {
                        S4D_APP_NOBLOX.getPlayerThumbnail((gained_roblox_user_id), 720, "png", false, "Body").then(async(roblox_user_thumbnail) => {
                            var VerifyPass = new Discord.MessageEmbed();
                            VerifyPass.setColor('#cccccc');
                            VerifyPass.setTitle(String('Verification'))
                            VerifyPass.setURL(String());
                            VerifyPass.setDescription(String((['Hello,', [roblox_user_info.username, '(', roblox_user_info.displayName, ')'].join(''), '!', 'Thanks for verifying! Enjoy your stay.'].join(''))));
                            VerifyPass.setImage(String((roblox_user_thumbnail[0].imageUrl)));
                            VerifyPass.setThumbnail(String((roblox_user_thumbnail[0].imageUrl)));
                            VerifyPass.setTimestamp(new Date());

                            (s4dmessage.member).roles.add();
                            await interaction.reply({
                                embeds: [VerifyPass],
                                ephemeral: true,
                                components: []
                            });
                        })
                    })
                } else {
                    var VerifyFail = new Discord.MessageEmbed();
                    VerifyFail.setColor('#cccccc');
                    VerifyFail.setTitle(String('Verification'))
                    VerifyFail.setURL(String());
                    VerifyFail.setDescription(String((['Hello,', (interaction.member).nickname == null ? (interaction.member).user.username : (interaction.member).nickname, '.', 'You entered a wrong username or a display name. Try again.'].join(''))));
                    await interaction.reply({
                        embeds: [VerifyFail],
                        ephemeral: true,
                        components: []
                    });
                }
            })
        }
    });
    return s4d;
})();