clear();
function clear() {
	message.delete();
	if (!params[1]) return message.author.send(`Укажите число сообщений`);
	let pars = Number.parseInt(params[1]);
	if (pars <= 0) return message.author.send(`Укажите число больше 0`);
	message.channel.bulkDelete(pars)
   		let cls = new RichEmbed()
		.setColor(0xf04747)
		.setTitle(`ОЧИСТКА ЧАТА`)
		.setDescription(`***<@${message.author.id}> удалил ${pars} сообщений в чате <#${message.channel.id}>***`)
		.setTimestamp()
		.setFooter('[MIRD BOT]');
	client.channels.get(config.moderch).send(cls);
	console.log(warning(` ${message.author.id} удалил ${pars} сообщений в чате ${message.channel.id}`));

}