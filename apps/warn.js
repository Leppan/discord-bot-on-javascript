warn();
function warn() {
	message.delete();
	if (!message.member.roles.get(config.moderrole)) return message.author.send(`У вас недостаточно прав на выполнение данной команды!`);

	if (!params[1]) return message.author.send(`Вы не указали пользователя`);
	    var rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(params[1]));
	if (!rUser) return message.author.send("Пользователь не найден");
	if (!params[2]) return message.author.send("Укажите причину");
	if(message.member.roles.get(config.moderrole) && rUser.roles.get(config.moderrole)) return message.author.send(`Данный человек является модератором`);

	var user = params[1]
	user = user.replace(/\D/g,'');

		connection.query(`SELECT * FROM profile WHERE idd=${user};`,
			function(err, results, fields) {
				if (err != null) {
					console.log(info(` [MIRD] Result read to BD in file warn: ${results} Err: ${err}`))
				}
				let req = results[0];
				let warns = req.warns
				warns = warns + 1;
				if (warns <= 5) {
					let warn1 = message.guild.roles.find(r => r.name === config.warn1);
					let warn2 = message.guild.roles.find(r => r.name === config.warn2);
					let warn3 = message.guild.roles.find(r => r.name === config.warn3);
					let warn4 = message.guild.roles.find(r => r.name === config.warn4);
					let warn5 = message.guild.roles.find(r => r.name === config.warn5);
					let joinrole = message.guild.roles.find(r => r.name === config.joinrole);

					connection.query(`UPDATE profile SET warns=${warns} WHERE idd=${user};`,
						function(err, results, fields) {
							if (err != null) {
							  	console.log(info(` [MIRD] Result insert to BD in file warn: ${results} Err: ${err}`))
							}
						}
					);
					let member = message.guild.member(message.guild.members.get(user));
					let reason = params.slice(2).join(" ");
					connection.query(`UPDATE profile SET reawarn${warns}='${reason}' WHERE idd=${user};`,
						function(err, results, fields) {
							if (err != null) {
							  	console.log(info(` [MIRD] Result insert to BD in file warn: ${results} Err: ${err}`))
							}
						}
					);
					let embed = new RichEmbed()
				    .setColor(0xf04747)
				    .setTitle('**[MODERATION]**')
				    .addField('**Модератор**', `<@${message.author.id}>`, true)
					.addField('**Выдал варн**', `${params[1]}`, true)
					.addField('**Причина**', `**${reason}**`, true)
					.addField('**Всего варнов**', `**${warns}**`, true)
				    .setTimestamp()
				    .setFooter('[MIRD BOT]');
				    client.channels.get(config.moderch).send(embed);
				    member.send(embed);
				    console.log(warning(` Пользователь ${message.author.id} выдал варн ${user} причина: ${reason}`))
				    let checkrole = warns - 1;
				    if (checkrole == 0) {
				    	rUser.addRole(warn1);
				    } 
				    if (checkrole == 1) {
				    	rUser.removeRole(warn1);
				    	rUser.addRole(warn2);
				    }
				    if (checkrole == 2) {
				    	rUser.removeRole(warn2);
				    	rUser.addRole(warn3);
				    }				    
				    if (checkrole == 3) {
				    	rUser.removeRole(warn3);
				    	rUser.addRole(warn4);
				    }
				    if (checkrole == 4) {
				    	rUser.removeRole(warn4);
				    	rUser.addRole(warn5);
				    }
				} 
				if (warns > 5) {
					let member = message.guild.member(message.guild.members.get(user));

					let rqs;
					connection.query(`SELECT * FROM profile WHERE idd=${user};`,
						function(err, results, fields) {
							if (err != null) {
							  	console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
							}
						rqs = results[0];
							connection.query(`INSERT INTO banlist (name, idd, reamute, timemute, warns, reawarn1, reawarn2, reawarn3, reawarn4, reawarn5, reaban, timeban, moder) VALUES ('${firstrequest.name}', '${firstrequest.idd}', '${firstrequest.reamute}', '${firstrequest.timemute}', '${firstrequest.warns}', '${firstrequest.reawarn1}', '${firstrequest.reawarn2}', '${firstrequest.reawarn3}', '${firstrequest.reawarn4}', '${firstrequest.reawarn5}', '${params[2]}', 'perm', '${message.author.id}');`,
								function(err, results, fields) {
									if (err != null) {
							  			console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
									}
								}
							);
						}
					);

					connection.query(`DELETE FROM profile WHERE idd=${user};`,
						function(err, results, fields) {
							if (err != null) {
							  	console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
							}
						}
					);

					let embed = new RichEmbed()
				    .setColor(0xf04747)
				    .setTitle('**[MODERATION]**')
				    .addField('**Модератор**', `<@${message.author.id}>`, true)
					.addField('**Выдал бан**', `${params[1]}`, true)
					.addField('**Причина**', `**Слишком много варнов**`, true)
				    .setTimestamp()
				    .setFooter('[MIRD BOT]');
				    client.channels.get(config.moderch).send(embed);
				    member.ban(`Cлишком много варнов`);
				    console.log(warning(` Пользователь ${message.author.id} забанил ${user} причина: Слишком много варнов`));
				}
			}
		);
}