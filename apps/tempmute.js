tempmute();
function tempmute() {
	message.delete();
	if (!message.member.roles.get(config.moderrole) && !message.member.roles.get(config.adminrole)) return message.author.send(`У вас недостаточно прав на выполнение данной команды!`);
	if (!params[1]) return message.author.send(`Вы не указали пользователя`);
	    var rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(params[1]));
	if (!params[2]) return message.author.send("Укажите время");
	if (!params[3]) return message.author.send("Укажите меру времени (sec, min, hour, day, month, year)");
	if (!params[4]) return message.author.send("Укажите причину");
	if (!rUser) return message.author.send("Пользователь не найден");

	if (params[2] <= 0) return message.author.send("Укажите значение времени больше 0");
	if (params[2] > 60 && params[3] == `sec`) return message.author.send("Для данной меры времени максимальное значение 60")
	if (params[2] > 60 && params[3] == `min`) return message.author.send("Для данной меры времени максимальное значение 60")
	if (params[2] > 24 && params[3] == `hour`) return message.author.send("Для данной меры времени максимальное значение 24")
	if (params[2] > 31 && params[3] == `day`) return message.author.send("Для данной меры времени максимальное значение 31")
	if (params[2] > 12 && params[3] == `month`) return message.author.send("Для данной меры времени максимальное значение 12")
	if (params[2] > 10 && params[3] == `year`) return message.author.send("Для данной меры времени максимальное значение 10")

	if(message.member.roles.get(config.moderrole) && rUser.roles.get(config.moderrole)) return message.author.send(`Данный человек является модератором`)

	params[4] = params.slice(4).join(" ");

		connection.query(`SELECT * FROM profile WHERE idd=${message.mentions.users.first().id};`,
			function(err, results, fields) {
				if (err != null) {
					console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
				}
				var req = results[0];
				var unmutetime;

				if (params[3] == `sec`) {
				    let date = new Date;
				    var options = {
				        era: 'long',
				        year: 'numeric',
				        month: 'long',
				        day: 'numeric',
				        weekday: 'long',
				        timezone: 'UTC',
				        hour: 'numeric',
				        minute: 'numeric',
				        second: 'numeric'
				    };
				    date.setSeconds(date.getSeconds() + parseInt(params[2]));
				    unmutetime = date.toLocaleString("ru", options);
				}
				if (params[3] == `min`) {
				    let date = new Date;
				    var options = {
				        era: 'long',
				        year: 'numeric',
				        month: 'long',
				        day: 'numeric',
				        weekday: 'long',
				        timezone: 'UTC',
				        hour: 'numeric',
				        minute: 'numeric',
				        second: 'numeric'
				    };
				    date.setMinutes(date.getMinutes() + parseInt(params[2]));
				    unmutetime = date.toLocaleString("ru", options);
				}
				if (params[3] == `hour`) {
				    let date = new Date;
				    var options = {
				        era: 'long',
				        year: 'numeric',
				        month: 'long',
				        day: 'numeric',
				        weekday: 'long',
				        timezone: 'UTC',
				        hour: 'numeric',
				        minute: 'numeric',
				        second: 'numeric'
				    };
				    date.setHours(date.getHours() + parseInt(params[2]));
				    unmutetime = date.toLocaleString("ru", options);
				}
				if (params[3] == `day`) {
				    let date = new Date;
				    var options = {
				        era: 'long',
				        year: 'numeric',
				        month: 'long',
				        day: 'numeric',
				        weekday: 'long',
				        timezone: 'UTC',
				        hour: 'numeric',
				        minute: 'numeric',
				        second: 'numeric'
				    };
				    date.setDate(date.getDate() + parseInt(params[2]));
				    unmutetime = date.toLocaleString("ru", options);
				}
				if (params[3] == `month`) {
				    let date = new Date;
				    var options = {
				        era: 'long',
				        year: 'numeric',
				        month: 'long',
				        day: 'numeric',
				        weekday: 'long',
				        timezone: 'UTC',
				        hour: 'numeric',
				        minute: 'numeric',
				        second: 'numeric'
				    };
				    date.setMonth(date.getMonth() + parseInt(params[2]));
				    unmutetime = date.toLocaleString("ru", options);
				}
				if (params[3] == `year`) {
				    let date = new Date;
				    var options = {
				        era: 'long',
				        year: 'numeric',
				        month: 'long',
				        day: 'numeric',
				        weekday: 'long',
				        timezone: 'UTC',
				        hour: 'numeric',
				        minute: 'numeric',
				        second: 'numeric'
				    };
				    date.setFullYear(date.getFullYear() + parseInt(params[2]));
				    unmutetime = date.toLocaleString("ru", options);
				}
				if (unmutetime == null) return message.author.send(`Неверно указано время мута`);

				connection.query(`UPDATE profile SET timemute='${unmutetime}' WHERE idd=${message.mentions.users.first().id};`,
					function(err, results, fields) {
						if (err != null) {
							console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
						}
					}
				);
				connection.query(`UPDATE profile SET reamute='${params[4]}' WHERE idd=${message.mentions.users.first().id};`,
					function(err, results, fields) {
						if (err != null) {
							console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
						}
					}
				);
				let mrole = message.guild.roles.find(r => r.name === config.mute);
				if (!message.member.roles.get(config.mute)) {
					rUser.addRole(mrole);
				}
					var user = params[1]
					user = user.replace(/\D/g,'');
					let member = message.guild.member(message.guild.members.get(user));

					let embed = new RichEmbed()
					.setColor(0xf04747)
					.setTitle('**[MODERATION]**')
					.addField('**Модератор**', `<@${message.author.id}>`, true)
					.addField('**Выдал мут**', `${params[1]}`, true)
					.addField('**Причина**', `**${params[4]}**`, true)
					.addField('**На какое время:**', `**${params[2]} ${params[3]}**`, true)
					.addField('**Мут истекает:**', `**${unmutetime}**`, true)
					.setTimestamp()
					.setFooter('[MIRD BOT]');
					client.channels.get(config.moderch).send(embed);
					member.send(embed);
					console.log(warning(` Пользователь ${message.author.id} замутил ${user} причина: ${params[4]}`));
			}
		);
}