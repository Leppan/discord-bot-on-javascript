permamute();
function permamute() {
		message.delete();
	if (!message.member.roles.get(config.moderrole) && !message.member.roles.get(config.adminrole)) return message.author.send(`У вас недостаточно прав на выполнение данной команды!`);
	if (!params[1]) return message.author.send(`Вы не указали пользователя`);
	    var rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(params[1]));
	if (!params[2]) return message.author.send("Укажите причину");
	if (!rUser) return message.author.send("Пользователь не найден");

	if(message.member.roles.get(config.moderrole) && rUser.roles.get(config.moderrole)) return message.author.send(`Данный человек является модератором`)
	// if(message.member.roles.get(config.adminrole) && rUser.roles.get(config.moderrole))
	
	params[2] = params.slice(2).join(" ");

		connection.query(`SELECT * FROM profile WHERE idd=${message.mentions.users.first().id};`,
			function(err, results, fields) {
				if (err != null) {
					console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
				}
				var req = results[0];
						connection.query(`UPDATE profile SET timemute='Навсегда' WHERE idd=${message.mentions.users.first().id};`,
							function(err, results, fields) {
							  	if (err != null) {
							  		console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
							 	}
							}
						);
						connection.query(`UPDATE profile SET reamute='${params[2]}' WHERE idd=${message.mentions.users.first().id};`,
							function(err, results, fields) {
							  	if (err != null) {
							  		console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
							 	}
							}
						);
						let mrole = message.guild.roles.find(r => r.name === config.mute);
						if (!message.member.roles.get(config.mute)) {
							rUser.addRole(mrole);
						}
							let embed = new RichEmbed()
						    .setColor(0xf04747)
						    .setTitle('**[MODERATION]**')
						    .addField('**Модератор**', `<@${message.author.id}>`, true)
							.addField('**Выдал мут**', `${params[1]}`, true)
							.addField('**Причина**', `**${params[4]}**`, true)
							.addField('**На какое время:**', `**Навсегда**`, true)
							.addField('**Мут истекает:**', `**Никогда**`, true)
						    .setTimestamp()
						    .setFooter('[MIRD BOT]');
						    client.channels.get(config.moderch).send(embed);
			}
		);
}