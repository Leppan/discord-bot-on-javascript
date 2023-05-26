unwarn();
function unwarn() {
	message.delete();
    if (!message.member.roles.get(config.moderrole)) return message.author.send(`У вас недостаточно прав на выполнение данной команды!`);
	if (!params[1]) return message.author.send(`Вы не указали пользователя`);
	    var rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(params[1]));
	if (!rUser) return message.author.send("Пользователь не найден");

		var user = params[1]
		user = user.replace(/\D/g,'');

		connection.query(`SELECT * FROM profile WHERE idd=${user}`,
			function(err, results, fields) {
				if (err != null) {
					console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
				}
				let rqs = results[0];
				let warns = rqs.warns;
				if (warns == 0) {
					message.author.send(`У данного человека отсутствуют варны`)
					return;
				}
				warns = warns - 1;
				connection.query(`UPDATE profile SET warns='${warns}' WHERE idd=${user};`,
					function(err, results, fields) {
						if (err != null) {
							console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
						}
					}
				);
				warns = warns + 1;
				connection.query(`UPDATE profile SET reawarn${warns}='Нет' WHERE idd=${user};`,
					function(err, results, fields) {
						if (err != null) {
							console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
						}
					}
				);
				warns = warns - 1;

					let warn1 = message.guild.roles.find(r => r.name === config.warn1);
					let warn2 = message.guild.roles.find(r => r.name === config.warn2);
					let warn3 = message.guild.roles.find(r => r.name === config.warn3);
					let warn4 = message.guild.roles.find(r => r.name === config.warn4);
					let warn5 = message.guild.roles.find(r => r.name === config.warn5);
					let joinrole = message.guild.roles.find(r => r.name === config.joinrole);

				let embed = new RichEmbed()
				    .setColor('#7CFC00')
				    .setTitle('**[MODERATION]**')
				    .addField('**Модератор**', `<@${message.author.id}>`, true)
					.addField('**Понизил варн**', `${params[1]}`, true)
					.addField('**Всего варнов**', `**${warns}**`, true)
				    .setTimestamp()
				    .setFooter('[MIRD BOT]');
				client.channels.get(config.moderch).send(embed);

					if (warns == 0) {
				    	rUser.removeRole(warn1);
				    } 
				    if (warns == 1) {
				    	rUser.addRole(warn1);
				    	rUser.removeRole(warn2);
				    }
				    if (warns == 2) {
				    	rUser.addRole(warn2);
				    	rUser.removeRole(warn3);
				    }				    
				    if (warns == 3) {
				    	rUser.addRole(warn3);
				    	rUser.removeRole(warn4);
				    }
				    if (warns == 4) {
				    	rUser.addRole(warn4);
				    	rUser.removeRole(warn5);
				    }
				    console.log(warning(` Пользователь ${message.author.id} снял варн ${user}`));
			}
		);
}