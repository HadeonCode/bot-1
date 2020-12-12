const { executionAsyncResource } = require('async_hooks');
const { isContext } = require('vm');

let discord = require('discord.js'),
    bot = new discord.Client(),
    token = 'hahatoken',
    commando = require(`discord.js-commando`),
    db = require (`quick.db`),
    dt = require(`date-time`),
    date = dt(),
    pd = require(`pretty-date`),
    HAPI = "da8b3552-723b-4bc2-b2d7-45a4d88312dd",
    fetch = require(`cross-fetch`),
    hypixel = require(`hypixel-api-nodejs`),
    ytdl = require(`ytdl-core`),
    ping = require(`minecraft-server-util`)


const { readdirSync } = require(`fs`);
const { join } = require(`path`);

bot.commands = new discord.Collection();

const commandFiles = readdirSync(join(__dirname, "commands")).filter(file => file.endsWith(".js"));
let isOnline = [];
let number = commandFiles.length;
for (const file of commandFiles) {
    const command = require(join(__dirname, "commands", `${file}`));
    bot.commands.set(command.name, command);
    isOnline.push(command.name);
    number = number -1;

    if(number == 1) console.log(isOnline)
}










bot.on("message", async message => {

    if(message.author.bot) return;
    if(message.channel.type == "dm") return;
    let prefix = db.fetch(`prefix_${message.guild.id}`);
    if(!prefix || prefix == null || prefix == undefined) db.set(`prefix_${message.guild.id}`, '?');
    prefix = db.fetch(`prefix_${message.guild.id}`);
    let inv = new db.table(`inv_${message.guild.id}_${message.author.id}`),
        coins = db.fetch(`coins_${message.guild.id}_${message.author.id}`),
        coindb = `coins_${message.guild.id}_${message.author.id}`,
        xpboosts = inv.get(`xbpboost`),
        coinboosts = inv.get(`coinboost`)

    if(message.content.startsWith(prefix)){
        const args = message.content.slice(prefix.length).trim().split(/ +/g);

        const command = args.shift().toLowerCase();
        console.log(command);
        console.log(args);
        
        if(!bot.commands.has(command)) return;

        try {
            bot.commands.get(command).run(bot, message, args, prefix, inv, coins, coindb, xpboosts, coinboosts);
        } catch (error){
            console.error(error);
        }
    }
});



bot.on('guildMemberAdd', async member => {
    let autoroleQ = db.fetch(`autorole?_${member.guild.id}`);
    if(autoroleQ == "no" || autoroleQ == undefined || autoroleQ == null) return console.log(`no`)
    if(autoroleQ == "yes"){

        let autorole = db.fetch(`autorole_${member.guild.id}`);
        if(!autorole || autorole == undefined || autorole == null || isNaN(autorole)) return console.log(`one ${autorole}`);

        let ROLE = member.guild.roles.cache.get(autorole);
        if(!ROLE || ROLE == undefined || ROLE == null) return console.log(`two ${ROLE}`);

        member.roles.add(ROLE);

    } else return console.log(`no`);
});

bot.on('message', async message => {

    
    bot.user.setPresence({
        status: "idle",
        activity: {
            name: `over ${bot.guilds.cache.size} servers`,
            type: "WATCHING"
        }
    });
    
    if(message.content.toLowerCase().startsWith("<@769175098435043368>prefix") || message.content.toLowerCase().startsWith("<@769175098435043368> prefix")){
        
        if(!args[0]){
            let embed = new discord.MessageEmbed()
            .setDescription(`**Server: ${message.guild.name}** \n **Prefix: \`\`${prefix}\`\`**`)
            .setFooter(`To change this use ${prefix}prefix (NEW PREFIX)`)
            .setThumbnail(message.guild.iconURL())
            .setColor("RANDOM")
            return message.channel.send(embed)
        }
        if(!message.member.hasPermission(`MANAGE_GUILD`)) return message.reply(`You must have manage server permissions!`)
        if (prefix == args[0]) return message.reply(`You can't fool me! That isn't going to change the prefix!`);

        db.set(`prefix_${message.guild.id}`, args[0]);
        message.reply(`Your new server prefix is **${db.fetch(`prefix_${message.guild.id}`)}**`);
    };

    

    let prefix = db.fetch(`prefix_${message.guild.id}`);
    if(!prefix || prefix == undefined || prefix == null || prefix == "null") db.set(`prefix_${message.guild.id}`, "?");
    if(!message.content.startsWith(prefix)) return;

    let messageArray = message.content.split(` `);
    let args = messageArray.slice(1);

    
}); 


    


bot.on('message', async message => {
    prefix = db.fetch(`prefix_${message.guild.id}`)
    let xpboosted = db.fetch(`boosted_${message.guild.id}_${message.author.id}`);
    if(xpboosted == null || xpboosted == undefined) db.set(`boosted_${message.guild.id}_${message.author.id}`, 'no');
    xpboosted = db.fetch(`boosted_${message.guild.id}_${message.author.id}`);


    // XP SYSTEM 


    if(message.author.bot) return;
    if(message.content.startsWith(prefix)) return;
    
    let xp = db.fetch(`xp_${message.guild.id}_${message.author.id}`),
        level = db.fetch(`lvl_${message.guild.id}_${message.author.id}`),
        xpAdd = (Math.floor((Math.random () * 10) + 1))
        xpNeeded = Number(level * ((level / 2) * 150));
    
    if(level == null) { db.set(`lvl_${message.guild.id}_${message.author.id}`, 0); };
    if(level = 0) xpNeeded = 150;


    

    if(xpboosted == 'yes') {xpAdd = ((Math.floor(Math.random () * 10) + 1) * 2); }
    
    db.add(`xp_${message.guild.id}_${message.author.id}`, Number(xpAdd));
    console.log(`Gained ${Number(xpAdd)} XP`);
        
    if(xp >= xpNeeded){

        db.add(`lvl_${message.guild.id}_${message.author.id}`, 1);
        db.set(`xp_${message.guild.id}_${message.author.id}`, 0);
        let embed = new discord.MessageEmbed()
        .setDescription(`<@${message.author.id}>. Congratulations, you have reached level ${db.fetch(`lvl_${message.guild.id}_${message.author.id}`)}!`)
        .setColor("RANDOM");
        message.channel.send(embed).then(msg => {
            msg.delete({ timeout: 5000 });
        }) 
    }

     
        
    
    

   

    // COIN SYSTEM

    let coins = db.fetch(`coins_${message.guild.id}_${message.author.id}`),
        coindb = `coins_${message.guild.id}_${message.author.id}`,
        coinadd = Math.floor(Math.random () * 20) + 1,
        boosted2 = db.fetch(`boosted2_${message.guild.id}_${message.author.id}`);
    console.log(coinadd)
    if(boosted2 = 'yes') coinadd = (coinadd * 2);
    if((Math.floor(Math.random () * 10 + 1) == 3)){
        db.add(`coins_${message.guild.id}_${message.author.id}`, coinadd);
        console.log(`${coinadd} Added!`);
        console.log(`COIN ADDED`)

    }

    
});


bot.login(token)
