permaban();
function permaban() {
			message.delete();
	if (!message.member.roles.get(config.moderrole) && !message.member.roles.get(config.adminrole)) return message.author.send(`У вас недостаточно прав на выполнение данной команды!`);
	if (!params[1]) return message.author.send(`Вы не указали пользователя`);
	    var rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(params[1]));
	if (!params[2]) return message.author.send("Укажите причину");
	if (!rUser) return message.author.send("Пользователь не найден");

	if(message.member.roles.get(config.moderrole) && rUser.roles.get(config.moderrole)) return message.author.send(`Данный человек является модератором`)
	// if(message.member.roles.get(config.adminrole) && rUser.roles.get(config.moderrole))
	
	params[2] = params.slice(2).join(" ");

	connection.query(`SELECT * FROM banlist WHERE idd=${rUser.id}`,
		function(err, results, fields) {
			if (err != null) {
				console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
			}
			var resb = Object.keys(results).length;
			if (resb != 0) {
				message.author.send(`Этот человек уже забанен`)
			} else {
					let member = message.guild.member(message.guild.members.get(rUser.id));
					let rqs;
						connection.query(`SELECT * FROM profile WHERE idd=${rUser.id};`,
							function(err, results, fields) {
								if (err != null) {
									console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
								}
								firstrequest = results[0];
								connection.query(`INSERT INTO banlist (name, idd, reamute, timemute, warns, reawarn1, reawarn2, reawarn3, reawarn4, reawarn5, reaban, timeban, moder) VALUES ('${firstrequest.name}', '${firstrequest.idd}', '${firstrequest.reamute}', '${firstrequest.timemute}', '${firstrequest.warns}', '${firstrequest.reawarn1}', '${firstrequest.reawarn2}', '${firstrequest.reawarn3}', '${firstrequest.reawarn4}', '${firstrequest.reawarn5}', '${params[2]}', 'perm', '${message.author.id}');`,
									function(err, results, fields) {
										if (err != null) {
											console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
										}
									}
								);
							}
						);

						connection.query(`DELETE FROM profile WHERE idd=${rUser.id};`,
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
						.addField('**Причина**', `**${params[2]}**`, true)
						.addField('**На какое время:**', `**Навсегда**`, true)
						.addField('**Бан истекает:**', `**Никогда**`, true)
						.setTimestamp()
						.setFooter('[MIRD BOT]');
						client.channels.get(config.moderch).send(embed);
						member.ban(`${params[2]}`);
						console.log(warning(` Пользователь ${message.author.id} забанил ${rUser.id} причина: ${params[2]}`));
			}
		}
	);

}

