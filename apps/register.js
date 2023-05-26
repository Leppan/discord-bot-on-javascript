reg();
function reg() {
	message.delete();
	if (message.channel.id != config.regch) return;
	var rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(message.author.id));
	let regr = message.guild.roles.find(r => r.name === config.joinrole);

		connection.query(`SELECT * FROM profile WHERE idd=${message.author.id};`,
			function(err, results, fields) {
				if (err != null) {
					console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
				}
				var rrs = Object.keys(results).length;
				if (rrs != 0 ) {
					message.author.send(`Вы уже зарегистрированы в базе данных`)
					let regr = message.guild.roles.find(r => r.name === config.joinrole);
					rUser.addRole(regr);
				} else {
					connection.query(`INSERT INTO profile (name, idd, onserver, warns, reawarn1, reawarn2, reawarn3, reawarn4, reawarn5, balance, lvl) VALUES ('${message.author.username}', '${message.author.id}', '1', '0', 'Нет', 'Нет', 'Нет', 'Нет', 'Нет', 10000, 0);`,
						function(err, results, fields) {
							if (err != null) {
							  	console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
							}
						}
					);
					if (config.joinroleenable == true) {
						let regr = message.guild.roles.find(r => r.name === config.joinrole);
						rUser.addRole(regr);
					} // Определение роли для только прибывших
					let reg = new RichEmbed()
				   	.setColor(0x7FFF00)
				    .setTitle(`Регистрация`)
				    .setDescription(`***<@${message.author.id}> вы успешно зарегистрировались***`)
				    .setTimestamp()
				    .setFooter('[MIRD BOT]');
					message.author.send(reg)
					let reg2 = new RichEmbed()
				   	.setColor(0x7FFF00)
				    .setTitle(`Регистрация`)
				    .setDescription(`***<@${message.author.id}> успешно зарегистрирован***`)
				    .setTimestamp()
				    .setFooter('[MIRD BOT] Для регистрации введите !register');
					message.channel.send(reg2)
				}
			}
		);
}