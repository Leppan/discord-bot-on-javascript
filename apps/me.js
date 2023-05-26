me();
function me(){
	message.delete();
	if (message.channel.id != config.commandch) return;
	connection.query(`SELECT * FROM profile WHERE idd=${message.author.id};`, async(err, results, fields) => {
				if (err != null) {
					console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
				}
				var rsme = Object.keys(results).length;
				if (rsme != 0 ) {

					let embed = new RichEmbed()
					.setColor(0xFFD700)
					.setTitle('**[INFO]**')
					.addField('**Пользователь**', `** ${results[0].name} **`, true)
					.addField('**Баланс**', `**${results[0].balance} коинов**`, true)
					.setThumbnail(message.author.avatarURL)
					.setTimestamp()
					.setFooter(`[MIRD BOT] ID USER IN BASE ${results[0].id}`);

					let mess = await message.channel.send(embed);

					await mess.react('1⃣')
					await mess.react('2⃣')

					let collector = mess.createReactionCollector((reaction, user) => (reaction.emoji.name === '1⃣' || reaction.emoji.name === '2⃣') && user.id === message.author.id)
					collector.on('collect', async r => {
					switch(r.emoji.name) {
					  case '1⃣': // 1
					   
					    let str1 = new RichEmbed()
						.setColor(0xFFD700)
						.setTitle('**[INFO]**')
						.addField('**Пользователь**', `** ${results[0].name} **`, true)
						.addField('**Баланс**', `**${results[0].balance} коинов**`, true)
						.setThumbnail(message.author.avatarURL)
						.setTimestamp()
						.setFooter(`[MIRD BOT] ID USER IN BASE ${results[0].id}`);

					    await mess.edit(str1);

					  break
					  case '2⃣': // 2

					    let str2 = new RichEmbed()
						.setColor(0xFFD700)
						.setTitle('**[INFO]**')
						.addField('**Пользователь**', `** ${results[0].name} **`, true)
						.addField('**Количество варнов**', `**[**${results[0].warns}**]**`, true)
						.addField('**Причина 1 го варна**', `**${results[0].reawarn1}**`)
						.addField('**Причина 2 го варна**', `**${results[0].reawarn2}**`)
						.addField('**Причина 3 го варна**', `**${results[0].reawarn3}**`)
						.addField('**Причина 4 го варна**', `**${results[0].reawarn4}**`)
						.addField('**Причина 5 го варна**', `**${results[0].reawarn5}**`)
						.addField('**Причина мута**', `**${results[0].reamute}**`)
						.addField('**Время мута**', `**${results[0].timemute}**`)
						.setThumbnail(message.author.avatarURL)
						.setTimestamp()
						.setFooter(`[MIRD BOT] ID USER IN BASE ${results[0].id}`);

					    await mess.edit(str2);

					  break
					}
					});
				 	console.log(warning(` Пользователь ${message.author.id} запросил инфо о себе`))
			 	} else {
			 		message.author.send(`Ваш профиль не был найден в базе данных, обратитесь к администратору`)
			 	}
			}
		);
}