deb();
function deb(){
	message.delete();
	if (!message.member.roles.get(config.moderrole)) return message.author.send(`У вас недостаточно прав на выполнение данной команды!`);
	if (message.channel.id != config.moderch) return;
	var localping = client.ping;
		localping = Math.round(localping);
	var localstatus = client.status;
	var localuptime = client.uptime;
	var millisec = localuptime;

	var seconds = (millisec / 1000).toFixed(1);
		seconds = Math.trunc(seconds);

	var minutes = (millisec / (1000 * 60)).toFixed(1);
	    minutes = Math.trunc(minutes);

	var hours = (millisec / (1000 * 60 * 60)).toFixed(1);
	    hours = Math.trunc(hours);

	var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);
	    days = Math.trunc(days);

	var localuptimeredact = `${seconds} секунд ${minutes} минут ${hours} часов ${days} дней`

	var localpings = client.pings;
	 	const embed = new RichEmbed()
	 	 	.setTitle('**Debug**')
		 	.setColor("#00FFFF")
		 	.addField('**Ping**', `**${localping}**`)
		 	.addField('**Uptime**', `**${localuptimeredact}**`)
		 	.setTimestamp()
		 	.setFooter('[MIRD]');
	message.channel.send(embed);
}