tempban();
function tempban() {
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

	connection.query(`SELECT * FROM profile WHERE idd=${rUser.id};`, // не забыть аналогично сделать в tempmute и permamute
		function(err, results, fields) {
			if (err != null) {
				console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
			}
			var firstrequest = results[0];
			if (firstrequest == undefined) return message.author.send('Пользователя нет в бд')
			var unbantime;

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
				unbantime = date.toLocaleString("ru", options);
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
				unbantime = date.toLocaleString("ru", options);
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
				unbantime = date.toLocaleString("ru", options);
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
				unbantime = date.toLocaleString("ru", options);
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
				unbantime = date.toLocaleString("ru", options);
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
				unbantime = date.toLocaleString("ru", options);
			}
			if (unbantime == null) return message.author.send(`Неверно указано время бана`);

			connection.query(`SELECT * FROM banlist WHERE idd=${rUser.id};`, // не забыть аналогично сделать в tempmute и permamute
				function(err, results, fields) {
					if (err != null) {
						console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
					}
					var resb = Object.keys(results).length;
					if (resb != 0) {
						message.author.send(`Этот человек уже забанен`)
					} else {
						let reason = params.slice(4).join(" ");

						connection.query(`INSERT INTO banlist (name, idd, reamute, timemute, warns, reawarn1, reawarn2, reawarn3, reawarn4, reawarn5, reaban, timeban, moder) VALUES ('${firstrequest.name}', '${firstrequest.idd}', '${firstrequest.reamute}', '${firstrequest.timemute}', '${firstrequest.warns}', '${firstrequest.reawarn1}', '${firstrequest.reawarn2}', '${firstrequest.reawarn3}', '${firstrequest.reawarn4}', '${firstrequest.reawarn5}', '${reason}', '${unbantime}', '${message.author.id}');`,
							function(err, results, fields) {
								if (err != null) {
									console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
								}
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
						.addField('**Причина**', `**${reason}**`, true)
						.addField('**На какое время:**', `**${params[2]} ${params[3]}**`, true)
						.addField('**Бан истекает:**', `**${unbantime}**`, true)
						.setTimestamp()
						.setFooter('[MIRD BOT]');
						client.channels.get(config.moderch).send(embed);
						rUser.ban(`${reason}`);
						console.log(warning(` Пользователь ${message.author.id} забанил ${rUser} причина: ${reason}`));

					}
				}
			);
		}
	);
}