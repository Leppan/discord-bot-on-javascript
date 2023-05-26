/*ideach();
async function ideach() {
	if (message.channel.id != config.ideach) return;
	if (!params[1]) return message.author.send(`Укажите вопрос`);
	params[1] = params.slice(1).join(" ");

	let question = new RichEmbed()
	.setTitle('**Идея**')
	.addField('**От кого**', `<@${message.author.id}>`, true)
	.addField('**Суть идеи**', `${params[1]}`, true)
	.setTimestamp()
	.setFooter('[MIRD BOT]');
	let mess = await message.channel.send(question);
	await mess.react('📕');
	await mess.react('📗');

		let collector = mess.createReactionCollector((reaction, user) => (reaction.emoji.name === '📕' || reaction.emoji.name === '📗') && user.id != config.botid);
		collector.on('collect', async r => {
	    switch(r.emoji.name) {
	        case '📕':
	        		console.log(r)
	        		let questionr = new RichEmbed()
					.setTitle('**Идея**')
					.setColor('f04747')
					.addField('**От кого**', `<@${message.author.id}>`, true)
					.addField('**Суть идеи**', `${params[1]}`, true)
					.addField('**Статус идеи**', `***Отклонена***`, true)
					.setTimestamp()
					.setFooter('[MIRD BOT]');
					mess.reactions.get('📕').remove(message.author.id);
					mess.reactions.get('📗').remove(message.author.id);
					await mess.edit(questionr);
	        break
	        case '📗':
	        		let questiong = new RichEmbed()
					.setTitle('**Идея**')
					.setColor('#7CFC00')
					.addField('**От кого**', `<@${message.author.id}>`, true)
					.addField('**Суть идеи**', `${params[1]}`, true)
					.addField('**Статус идеи**', `***Одобрена***`, true)
					.setTimestamp()
					.setFooter('[MIRD BOT]');
					mess.reactions.get('📕').remove(message.author.id);
					mess.reactions.get('📗').remove(message.author.id);
					await mess.edit(questiong);
	        break
	    }
		});
}*/