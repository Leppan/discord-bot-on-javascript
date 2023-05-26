let Discord = require('discord.js');
let { Client, RichEmbed } = require('discord.js');
let fs = require('fs');
let ms = require('ms');
let chalk = require('chalk');
let request = require('request');
let config = require('./config.json');
let mysql = require("mysql2");

const client = new Discord.Client();

const noneer = chalk.bold.green;
const info = chalk.bold.cyan;
const error = chalk.bold.red;
const warning = chalk.keyword('orange');

var time;

// LINK MYSQL

const connection = mysql.createConnection({
  host: config.mysqlhost,
  user: config.mysqluser,
  database: config.mysqldb,
  password: config.mysqlpass
});

connection.connect(function(err){
   if (err) {
     console.error(error(" [MIRD] Ошибка: " + err.message + " Проверьте настройки подключения к базе данных"));
     exit();
   }
   else{
     console.log(info(`
 =======================================================
 [MIRD] Подключение к серверу MySQL успешно установлено
 =======================================================
 HOST: ${config.mysqlhost}
 USER: ${config.mysqluser}
 DATABASE: ${config.mysqldb}
 PASSWORD: ${config.mysqlpass}
 =======================================================
  `));
   }
});

// END LINK MYSQL

client.once('ready', () => {
	console.log()
 console.log(noneer(' [MIRD] Discord.js Loaded'));
 client.user.setPresence({status: 'online', game:{name: `${config.prefix}help | ${config.prefix}register`, type: 2}});
    setInterval(function() {
    	time = new Date();
    }, 1 * 1000)
    setInterval(function() {
    	let date = new Date;
		var options = {
			era: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			weekday: 'long',
			timezone: 'UTC',
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric'
		};
		var ddate = date.toLocaleString("ru", options); // формат времени
		connection.query(`SELECT * FROM profile WHERE timemute='${ddate}';`,
			function(err, results, fields) {
				if (err != null) {
					console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
				}
				if (results.length == 0) {
				} else {
					var res = results[0];
					client.guilds.get(config.gid).members.get(results[0].idd).removeRole(config.muteid);
					connection.query(`UPDATE profile SET timemute='' WHERE idd=${results[0].idd};`,
						function(err, results, fields) {
							if (err != null) {
								console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
							}
						}
					);
					connection.query(`UPDATE profile SET reamute='' WHERE idd=${results[0].idd};`,
						function(err, results, fields) {
							if (err != null) {
								console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
							}
						}
					);
					let embed = new RichEmbed()
				    .setColor('#7CFC00')
				    .setTitle('**[MODERATION]**')
					.addField('**Был снят мут**', `**По истечении времени**`, true)
					.addField('**Пользователю**', `**<@${results[0].idd}>**`, true)
				    .setTimestamp()
				    .setFooter('[MIRD BOT]');
					client.channels.get(config.moderch).send(embed);
				}
			}
		);
    }, 1 * 1000)

    setInterval(function() {
    	let date = new Date;
		var options = {
			era: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			weekday: 'long',
			timezone: 'UTC',
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric'
		};
		var ddate = date.toLocaleString("ru", options); // формат времени
		connection.query(`SELECT * FROM banlist WHERE timeban='${ddate}';`,
			function(err, results, fields) {
				if (err != null) {
					console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
				}
				if (results.length == 0) {
				} else {
					var res = results[0];
					client.guilds.get(config.gid).unban(results[0].idd);
					connection.query(`DELETE FROM banlist WHERE idd=${results[0].idd};`,
						function(err, results, fields) {
							if (err != null) {
								console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
							}
						}
					);
					let embed = new RichEmbed()
				    .setColor('#7CFC00')
				    .setTitle('**[MODERATION]**')
					.addField('**Был разбанен**', `**По истечении времени**`, true)
					.addField('**Пользователь**', `**<@${results[0].idd}>**`, true)
				    .setTimestamp()
				    .setFooter('[MIRD BOT]');
					client.channels.get(config.moderch).send(embed);
				}
			}
		);
    }, 1 * 1000)
    setInterval(function() {
    	let all = client.channels.find(channel => channel.id === config.all);
		all.setName(`${client.guilds.get(config.gid).memberCount} Всего людей 👥`)
    }, 1 * 10000)    
    setInterval(function () {
		connection.query(`SELECT COUNT(*) FROM profile;`,
			function(err, results, fields) {
				if (err != null) {
					connection.connect(function(err){
					   if (err) {
					     console.error(error(" [MIRD] Ошибка: " + err.message + " Проверьте настройки подключения к базе данных"));
					     exit();
					   }
					   else{
					     console.log(info(`
					 ===========================================================
					 [MIRD] Переподключение к серверу MySQL успешно установлено
					 ===========================================================
					 HOST: ${config.mysqlhost}
					 USER: ${config.mysqluser}
					 DATABASE: ${config.mysqldb}
					 PASSWORD: ${config.mysqlpass}
					 ===========================================================
					  `));
					   }
					});
				}
			}
		);
	}, 1 * 30000);
	setInterval(function () {
		connection.query(`INSERT INTO stats (time, online) VALUES ("${time}", "${client.guilds.get(config.gid).memberCount}");`,
			function(err, results, fields) {
				if (err != null) {
					console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
				}
			}
		);
	}, 1 * 600000);
});

client.once('reconnecting', () => {
 console.log(error(' [MIRD] Discord.js Reconnecting'));
});

client.once('disconnect', () => {
 console.log(error(' [MIRD] Discord.js Disconnect'));
});

client.once('error', (error) => {
 console.log(error(` [MIRD] ${error}`));
});

client.on('message', async message => {
	if (message.author.bot) return;
	if (message.channel.type == "dm") return;
	if (message.channel.id == config.ideach) {
		message.delete();
	}
	if (message.content.startsWith(config.prefix)){
		var args=message.content.slice(config.prefix.length).split(' '),
			cmd=args.shift().toLowerCase(),
			arg=message.content.slice(+1 + +config.prefix.length + +cmd.length);
			params=message.content.split(' ');
		if (cmd){
			fs.access(`./apps/${cmd}.js`, function(err){
			    if (err) {
			        message.delete();
			        message.author.send("Неизвестная команда")
			    } else {
			        fs.readFile(`./apps/${cmd}.js`,(err,script)=>{
			            if (err) {
			                console.log(error( ` [MIRD] Ошибка: ${err}`))
			            } else {
			                try {
			                    eval(script.toString())
			                } catch(err) {
			                    console.log(error( ` [MIRD] Ошибка: ${err}`))
			                }
			            }
			        })
			    }
			})
		}
	}
});

client.on('guildMemberAdd',(member)=>{
	try {
		let joinch = client.channels.get(config.joinchannel);
		let hello = new RichEmbed()
		   	.setColor(0x7FFF00)
		    .setTitle(`Добро пожаловать`)
		    .setDescription(`Привет, ***${member.user.username}***, заходи, располагайся, добро пожаловать на сервер`)
		    .setTimestamp()
		    .setFooter('[MIRD BOT]');
			joinch.send(hello);

			if (config.joinroleenable == true) { member.addRole(member.guild.roles.find(x => x.name === config.joinrole)); } // Определение роли для только прибывших

			connection.query(`SELECT * FROM profile WHERE idd=${member.user.id};`,
			function(err, results, fields) {
					if (err != null) {	
						console.log(info(` [MIRD] Result BD: ${results}  Err: ${err}`))
					}

					connection.query(`SELECT * FROM banlist WHERE idd=${member.user.id};`,
						function(err, results, fields) {
							if (err != null) {
							  	console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
							}
							var brs = Object.keys(results).length;
							if (brs != 0) {
								connection.query(`DELETE FROM profile WHERE idd=${member.user.id};`,
									function(err, results, fields) {
										if (err != null) {
										  	console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
										}
									}
								);
								let embed = new RichEmbed()
							    .setColor(0xf04747)
							    .setTitle('**[MODERATION]**')
							    .addField('**Модератор**', `**CONSOLE**`, true)
								.addField('**Выдал бан**', `**${member.user.id}**`, true)
								.addField('**Причина**', `**${results[0].reaban} (Перезаход на сервер)**`, true)
							    .setTimestamp()
							    .setFooter('[MIRD BOT]');
							    client.channels.get(config.moderch).send(embed);
							    console.log(warning(` Пользователь ${member.user.id} забанил CONSOLE причина: ${results[0].reaban} (Перезаход на сервер)`));
							    member.ban(`${results[0].reaban} (Перезаход на сервер)`);
							    return;
							}
						}
					);
					var rs = Object.keys(results).length;

					if (rs != 0) {
					    connection.query(`UPDATE profile SET onserver='1' WHERE idd=${member.user.id};`,
							function(err, results, fields) {
							  	if (err != null) {
							  		console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
							 	}
							 		if (results[0].timemute != null) { // пофиксить
										member.addRole(member.guild.roles.find(x => x.name === config.mute));
									}
									if (results[0].warns != 0) {
										if (results[0].warns == 1) {
											member.addRole(member.guild.roles.find(x => x.name === config.warn1));
										}
										if (results[0].warns == 2) {
											member.addRole(member.guild.roles.find(x => x.name === config.warn2));
										}
										if (results[0].warns == 3) {
											member.addRole(member.guild.roles.find(x => x.name === config.warn3));
										}
										if (results[0].warns == 4) {
											member.addRole(member.guild.roles.find(x => x.name === config.warn4));
										}	
										if (results[0].warns == 5) {
											member.addRole(member.guild.roles.find(x => x.name === config.warn5));
										}
									}
							 	console.log(warning(` Участник ${member.user.id} вернулся на сервер`));
							}
						);
					} else {
						connection.query(`INSERT INTO profile (name, idd, onserver, reamute, timemute, warns, reawarn1, reawarn2, reawarn3, reawarn4, reawarn5, balance, lvl) VALUES ('${member.user.username}', '${member.user.id}', '1', '', '', '0', 'Нет', 'Нет', 'Нет', 'Нет', 'Нет', 10000, 0);`,
							function(err, results, fields) {
							  	if (err != null) {
							  		console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
							 	}
							 	console.log(warning(` Участник ${member.user.id} впервые зашел на сервер`));
							}
						);
					}
				}
			);
	} catch(err) {
		console.log(error( ` [MIRD] Ошибка: ${err}`))
	}
});

client.on('guildMemberRemove',(member) => {
	try {
		let joinch = client.channels.get(config.joinchannel);
		let exit = new RichEmbed()
		    .setColor(0xf04747)
		    .setTitle(`**Участник вышел**`)
		    .setDescription(`Пока, ***${member.user.username}***, надеюсь тебе было интересно здесь находиться, удачи!`)
		    .setTimestamp()
		    .setFooter('[MIRD BOT]');
		joinch.send(exit);

		connection.query(`UPDATE profile SET onserver='0' WHERE idd=${member.user.id};`,
		  	function(err, results, fields) {
		  		if (err != null) {	
		  			console.log(info(` [MIRD] Result off user in BD: ${results}  Err: ${err}`))
		  		}
		  	}
		);
		console.log(warning(` Участник ${member.user.id} вышел с сервера`));
	} catch(err) {
		console.log(error( ` [MIRD] Ошибка: ${err}`))
	}
});

client.on('messageUpdate', async (oldmsg, newmsg) => {
  if (oldmsg.author.bot || newmsg.author.bot || oldmsg.channel.type == "dm" || newmsg.channel.type == "dm" || oldmsg.content == newmsg.content) return;
  let logchannel = client.channels.get(config.logchat);
  let editmess = new Discord.RichEmbed()
  		.setTitle(`***Изменение сообщения***`)
  		.setDescription(`**👳‍♂️ Пользователь:** ${oldmsg.member}\n**📚 Канал:** ${oldmsg.channel}\n**📟 Старое сообщение:** ${oldmsg.content}\n**📟 Новое сообщение:** ${newmsg.content}`)
     	.setColor("#FFA500")
      	.setTimestamp()
      	.setFooter('[MIRD BOT]');
  logchannel.send(editmess);
});

client.on('messageDelete', async message => {
  if(message.author.bot) return;
  if (message.channel.id == config.commandch || message.channel.id == config.moderch || message.channel.id == config.regch) return;
  let logchannel = client.channels.get(config.logchat);
  let embed2 = new Discord.RichEmbed()
      .setTitle(`Удаление сообщения`)
      .setDescription(`**👳‍♂️ Пользователь:** ${message.member}\n**📚 Канал**: ${message.channel}\n**📟 Сообщение:** ${message.content}`)
      .setColor('#FF4500')
      .setTimestamp()
      .setFooter('[MIRD BOT]');
  logchannel.send(embed2);
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
	const vcOnline = client.channels.find(channel => channel.id === config.invoice);
	
	const voiceChannels = newMember.guild.channels.filter(c => c.type === 'voice');
	let count = 0;

	for (const [id, voiceChannel] of voiceChannels) count += voiceChannel.members.size;
	vcOnline.setName(`${count} В голосовом 🔊`)


	let newUserChannel = newMember.voiceChannel;
    let oldUserChannel = oldMember.voiceChannel;

    if(newUserChannel){
        const vcLogo = client.channels.find(channel => channel.id === config.logchat);
        const embed = new Discord.RichEmbed()
  		.setTitle(`***Голосовой канал***`)
  		.setDescription(`**👳‍♂️ Пользователь:** ${newMember}\n**📚 Зашел в канал:** ${newUserChannel}`)
     	.setColor("#FFA500")
      	.setTimestamp()
      	.setFooter('[MIRD BOT]');
        vcLogo.send({embed})
    }
    if(oldUserChannel){
        const vcLogo = client.channels.find(channel => channel.id === config.logchat);
        const embed = new Discord.RichEmbed()
        .setTitle(`***Голосовой канал***`)
  		.setDescription(`**👳‍♂️ Пользователь:** ${newMember}\n**📚 Вышел из канала:** ${oldUserChannel}`)
     	.setColor("#FFA500")
      	.setTimestamp()
      	.setFooter('[MIRD BOT]');
        vcLogo.send({embed})
    }
});

client.on('userUpdate', (oldUser, newUser) => {
	try {
		if (oldUser.username != newUser.username) {
			connection.query(`SELECT * FROM profile WHERE idd=${newUser.id};`,
				function(err, results, fields) {
				  	if (err != null) {	
				  		console.log(info(` [MIRD] Result off user in BD: ${results}  Err: ${err}`))
				  	}
				  	connection.query(`UPDATE profile SET name='${newUser.username}' WHERE idd=${newUser.id};`,
						function(err, results, fields) {
							if (err != null) {	
							  	console.log(info(` [MIRD] Result off user in BD: ${results}  Err: ${err}`))
							}
						}
					);
				}
			);
			console.log(warning(` Участник ${newUser.id} сменил никнейм`));
		}
	} catch(err){
		console.log(error(` [MIRD] Ошибка: ${err}`))
	}
});

client.on("presenceUpdate", (oldMember, newMember, members) => {
	try{
		let sv = client.guilds.find(guilds => guilds.id === config.gid);

		let allonline = client.channels.find(channel => channel.id === config.allonline);

		let online = client.channels.find(channel => channel.id === config.online);
		let idle = client.channels.find(channel => channel.id === config.idle);
		let dnd = client.channels.find(channel => channel.id === config.dnd);
		let offline = client.channels.find(channel => channel.id === config.offline);

		let onlmembers = sv.members.filter(members => members.presence.status === ("online")).size;
		let idlmembers = sv.members.filter(members => members.presence.status === ("idle")).size;
		let dndmembers = sv.members.filter(members => members.presence.status === ("dnd")).size;
		let offlinemembers = sv.members.filter(members => members.presence.status === ("offline")).size;

		allonline.setName(`${onlmembers + idlmembers + dndmembers} Всего онлайн 👨‍👨‍👦`)
		online.setName(`${onlmembers} В сети 📗`)
		idle.setName(`${idlmembers} Не активен 📒`)
		dnd.setName(`${dndmembers} Не беспокоить 📕`)
		offline.setName(`${offlinemembers} Не в сети 📓`)
	} catch(err) {
		console.log(err)
	}

});

function exit() {
	client.destroy();
	process.exit(1);
}

client.login(config.token);