unban();
function unban() {
	message.delete();
	if (!message.member.roles.get(config.moderrole)) return message.author.send(`У вас недостаточно прав на выполнение данной команды!`);
	if (!params[1]) return message.author.send(`Вы не указали пользователя`);
	var user = params[1]
	user = user.replace(/\D/g,'');
		connection.query(`SELECT * FROM banlist WHERE idd=${user};`,
			function(err, results, fields) {
				if (err != null) {
					console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
				}
				var resban = Object.keys(results).length;
				if (resban != 0 ) {
					var id = results[0].idd
					var name = results[0].name
					connection.query(`DELETE FROM banlist WHERE idd=${user};`,
						function(err, results, fields) {
							if (err != null) {
							  	console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
							}
						}
					);
					let embed = new RichEmbed()
				    .setColor('#7CFC00')
				    .setTitle('**[MODERATION]**')
				    .addField('**Модератор**', `**<@${message.author.id}>**`, true)
					.addField('**Разбанил**', `**${name}**`, true)
					.addField('**ID**', `**${id}**`, true)
				    .setTimestamp()
				    .setFooter('[MIRD BOT]');
				    client.channels.get(config.moderch).send(embed);
					message.guild.unban(id);
					console.log(warning(` Пользователь ${message.author.id} разбанил ${user}`))
				} else {
					message.author.send(`Данного человека нет в бане`)
				}
			}
		);
}