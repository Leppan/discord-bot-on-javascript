unmute();
function unmute() {
	message.delete();
	if (!message.member.roles.get(config.moderrole) && !message.member.roles.get(config.adminrole)) return message.author.send(`У вас недостаточно прав на выполнение данной команды!`);
	if (!params[1]) return message.author.send(`Вы не указали пользователя`);
	    var rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(params[1]));
	if (!rUser) return message.author.send("Пользователь не найден");

	if(message.member.roles.get(config.moderrole) && rUser.roles.get(config.moderrole)) return message.author.send(`Данный человек является модератором`);

	connection.query(`UPDATE profile SET reamute='' WHERE idd=${message.mentions.users.first().id};`,
		function(err, results, fields) {
			if (err != null) {
				console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
			}
		}
	);
	connection.query(`UPDATE profile SET timemute='' WHERE idd=${message.mentions.users.first().id};`,
		function(err, results, fields) {
			if (err != null) {
				console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
			}
		}
	);

	var user = params[1]
	user = user.replace(/\D/g,'');
	let member = message.guild.member(message.guild.members.get(user));

	let mrole = message.guild.roles.find(r => r.name === config.mute);
	rUser.removeRole(mrole);

	let embed = new RichEmbed()
	.setColor('#7CFC00')
	.setTitle('**[MODERATION]**')
	.addField('**Модератор**', `<@${message.author.id}>`, true)
	.addField('**Снял мут**', `${params[1]}`, true)
	.setTimestamp()
	.setFooter('[MIRD BOT]');
	client.channels.get(config.moderch).send(embed);
	member.send(embed);
	console.log(warning(` Пользователь ${message.author.id} размутил ${user}`));
}