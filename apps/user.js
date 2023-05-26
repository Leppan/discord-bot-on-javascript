user();
function user(){
	message.delete();
	if (!message.member.roles.get(config.moderrole)) return message.author.send(`У вас недостаточно прав на выполнение данной команды!`);
	if (!params[1]) return message.author.send(`Вы не указали пользователя`);
	    var rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(params[1]));
	if (!rUser) return message.author.send("Пользователь не найден");
		var user = params[1]
		user = user.replace(/\D/g,'');

		connection.query(`SELECT * FROM profile WHERE idd=${user};`,
			function(err, results, fields) {
				if (err != null) {
					console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
				}
				var rsme = Object.keys(results).length;
				if (rsme != 0 ) {
					let embed = new RichEmbed()
					.setColor(0xf04747)
					.setTitle('**[MODER-INFO]**')
					.addField('**Пользователь**', `** ${results[0].name} **`, true)
					.addField('**Количество варнов**', `**[**${results[0].warns}**]**`, true)
					.addField('**Причина 1 го варна**', `**${results[0].reawarn1}**`, true)
					.addField('**Причина 2 го варна**', `**${results[0].reawarn2}**`, true)
					.addField('**Причина 3 го варна**', `**${results[0].reawarn3}**`, true)
					.addField('**Причина 4 го варна**', `**${results[0].reawarn4}**`, true)
					.addField('**Причина 5 го варна**', `**${results[0].reawarn5}**`, true)
					.addField('**Причина мута**', `**${results[0].reamute}**`)
					.addField('**Время мута**', `**${results[0].timemute}**`)
					.addField('**Баланс**', `**${results[0].balance} коинов**`, true)
					.setTimestamp()
					.setFooter(`[MIRD BOT] ID USER IN BASE ${results[0].id}`);
					try {
				 	client.channels.get(config.moderch).send(embed);
				 	console.log(warning(` Пользователь ${message.author.id} запросил инфо о ${user}`))
				 	} catch(err) {
				 		console.log(error( ` [MIRD] Ошибка отправки сообщения: ${err}`));
				 	}
			 	} else {
			 		message.author.send(`Ваш профиль не был найден в базе данных, обратитесь к администратору`)
			 	}
			}
		);
}