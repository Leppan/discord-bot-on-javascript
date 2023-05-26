mafrole()
function mafrole() {
	message.delete();
	if (!message.member.roles.get(config.iventmasterrole)) return message.author.send(`У вас недостаточно прав на выполнение данной команды!`);
	if (!params[1]) return message.author.send(`Вы не указали добавить / убрать`);
	if (!params[2]) return message.author.send(`Вы не указали пользователя`);
	    var rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(params[2]));
	if (!rUser) return message.author.send("Пользователь не найден");
		
	if (params[1] == `add`) {
		let embed = new RichEmbed()
		.setColor(0xf04747)
		.setTitle('**IVENT**')
		.addField('**Ивентмастер**', `<@${message.author.id}>`, true)
		.addField('**Выдал Роль Игрока мафии**', `${params[2]}`, true)
		.setTimestamp()
		.setFooter('[MIRD BOT]');
		message.channel.send(embed);
		rUser.addRole(config.iventrole);
		return;
	} 
	if (params[1] == `remove`) {
		let embed = new RichEmbed()
		.setColor(0xf04747)
		.setTitle('**IVENT**')
		.addField('**Ивентмастер**', `<@${message.author.id}>`, true)
		.addField('**Убрал Роль Игрока мафии**', `${params[2]}`, true)
		.setTimestamp()
		.setFooter('[MIRD BOT]');
		message.channel.send(embed);
		rUser.removeRole(config.iventrole);
		return;
	}
		message.author.send(`Команда указана неправильно`)
}