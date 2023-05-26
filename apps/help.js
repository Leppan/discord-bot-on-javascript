help();
function help() {
		message.delete()
		if (message.channel.id != config.commandch) return;
		let embed = new RichEmbed()
			.setColor('C71585')
			.setTitle('**[Помощь]**')
			.addField('**Команды для игроков:**', `**${config.prefix}youtube - Информация о Froze1\n${config.prefix}me - Информация о себе\n${config.prefix}shop - открыть магазин\n${config.prefix}pay [кому перевести] [число] - Перевод коинов другому человеку\n${config.prefix}roll [число коинов] - Сыграть в рулетку\n${config.prefix}register - Зарегистрироваться в бд, если вы не зарегистрированыn${config.prefix}idea [суть идеи] - предложить идею**`)
			.addField('**Команды модерации**', `**${config.prefix}tempban [пользователь] [число временной еденицы] [sec, min, hour, day, month, year] [причина] - Выдать бан человеку\n${config.prefix}permaban [пользователь] [причина] - Выдать бан человеку навсегда\n${config.prefix}tempmute [пользователь] [число временной еденицы] [sec, min, hour, day, month, year] [причина] - Выдать мут человеку\n${config.prefix}permamute [пользователь] [причина] - Выдать мут человеку навсегда\n${config.prefix}user [пользователь] - Получить информацию о пользователе\n${config.prefix}clear [число сообщений] - удалить сообщения в определенном канале\n${config.prefix}warn [пользователь] [причина] - Дать предупреждение игроку\n${config.prefix}unwarn [пользователь] - Снять последнее предупреждение игроку\n${config.prefix}unban [пользователь] - Разбанить человека\n${config.prefix}debug - Запросить системную информацию**`)
			.addField('**Команды ивентмастеров**', `**${config.prefix}mafrole [add / remove] [пинг игрока] - Выдать / забрать роль игрока мафии**`)
			.setTimestamp()
			.setFooter(`[MIRD BOT]`);
			message.channel.send(embed);
}