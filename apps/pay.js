pay();
function pay() {
	message.delete();
	if (message.channel.id != config.commandch) return;
	if (!params[1]) return message.author.send(`Вы не указали пользователя`);
	    var rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(params[1]));
	if (!rUser) return message.author.send("Пользователь не найден");
	if (!params[2]) return message.author.send("Введите сумму");
	if (params[2].replace(/\s/g, '').length === 0 || isNaN(params[2])) return message.author.send(`Неправильно введена команда. Введите !pay [tag] [сумма]`);

	var user = params[1]
	user = user.replace(/\D/g,'');

	connection.query(`SELECT * FROM profile WHERE idd=${message.author.id};`, // Получаем данные от кого перевод
		function(err, results, fields) {
			if (err != null) {
					console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
				}
				var rsqs = Object.keys(results).length;
				let reqfrom = results[0];
				let balancereqfrom = Number.parseInt(reqfrom.balance);
				if (reqfrom.balance < params[2]) return message.author.send(`Нельзя отправить сумму больше, чем есть у вас на счету`)
				if (params[2] <= 0) return message.author.send(`Нельзя отправить сумму меньше либо равную 0`)
				if(rsqs != 0) {
					connection.query(`SELECT * FROM profile WHERE idd=${user};`, // Получаем данные того, кому перевести
						function(err, results, fields) {
							if (err != null) {
							  	console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
							}
							let reqto = results[0];
							let balancereqto = Number.parseInt(reqto.balance);
							params[2] = Number.parseInt(params[2]);
							balancereqfrom = balancereqfrom - params[2];
							balancereqto = balancereqto + params[2];

						    connection.query(`UPDATE profile SET balance=${balancereqfrom} WHERE idd=${message.author.id};`,
								function(err, results, fields) {
								  	if (err != null) {
								  		console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
								 	}
								}
							);

							connection.query(`UPDATE profile SET balance=${balancereqto} WHERE idd=${user};`,
								function(err, results, fields) {
								  	if (err != null) {
								  		console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
								 	}
								}
							);
							let embed = new RichEmbed()
						    .setColor('#7B68EE')
						    .setTitle('**[Перевод]**')
						    .setDescription(`
						    	**Пользователь: <@${message.author.id}>**
						    	**Перевел: ${params[2]}**
						    	**Человеку: <@${user}>**
						    	`)
						    .setTimestamp()
						    .setFooter('[MIRD BOT]');
						    message.channel.send(embed);
						    let embed2 = new RichEmbed()
						    .setColor('#7B68EE')
						    .setTitle('**[Перевод]**')
						    .setDescription(`**Вы успешно перевели: ${params[2]} человеку: <@${user}>**`)
						    .setTimestamp()
						    .setFooter('[MIRD BOT]');
						    message.author.send(embed2);
						}
					);
				} else {
					message.author.send(`Ваш профиль не был найден в базе данных, обратитесь к администратору`)
				}
			}
		);
}