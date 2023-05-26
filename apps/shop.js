shop();
function shop() {
	message.delete();
		if (message.channel.id != config.commandch) return;
		var rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(message.author.id));
		//Определение ролей
				var c;
				var b;
				var c1 = message.guild.roles.find(r => r.name === config.red);
				var c2 = message.guild.roles.find(r => r.name === config.orange);
				var c3 = message.guild.roles.find(r => r.name === config.yellow);
				var c4 = message.guild.roles.find(r => r.name === config.green);
				var c5 = message.guild.roles.find(r => r.name === config.blue);
				var c6 = message.guild.roles.find(r => r.name === config.fiol);
				var c7 = message.guild.roles.find(r => r.name === config.pink);
				var c8 = message.guild.roles.find(r => r.name === config.cyan);
		//цена каждой привилегии
				var c1b = 200000; //Color red
				var c2b = 200000; //Color orange
				var c3b = 200000; //Color Yellow
				var c4b = 200000; //Color green
				var c5b = 200000; //Color blue
				var c6b = 200000; //Color fiol
				var c7b = 200000; //Color pink
				var c8b = 200000; //Color cyan
				var c9b = 200000; //Clear Colors
		if (!params[1]) {
			let info_shop = new RichEmbed()
			.setColor(`#8B008B`)
			.setTitle('**[Магазин]**')
			.setDescription(`
				**====================================**
				**Цвета**
				**====================================**
				**[1]** ***${c1} - ${c1b} коинов***
				**[2]** ***${c2} - ${c2b} коинов***
				**[3]** ***${c3} - ${c3b} коинов***
				**[4]** ***${c4} - ${c4b} коинов***
				**[5]** ***${c5} - ${c5b} коинов***
				**[6]** ***${c6} - ${c6b} коинов***
				**[7]** ***${c7} - ${c7b} коинов***
				**[8]** ***${c8} - ${c8b} коинов***
				**[9]** ***Очистить цвет - ${c9b} коинов***
				**====================================**
				*Для покупки товара введите !shop [id товара]
				`)
			.setTimestamp()
			.setFooter('[MIRD BOT]');
			client.channels.get(config.commandch).send(info_shop);
		} else {
			if (params[1].replace(/\s/g, '').length === 0 || isNaN(params[1])) return message.author.send(`Нужно писать число`);
			if (params[1] <=0 || params[1]>9) return message.author.send(`Укажите число от 1 до 9`)
			connection.query(`SELECT * FROM profile WHERE idd=${message.author.id};`,
				function(err, results, fields) {
					if (err != null) {
						console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
					}
					let nparams = Number.parseInt(params[1]);
					let ubalance = Number.parseInt(results[0].balance);
					let cost;
					let role;
					if (nparams == 1) {cost=c1b; role=c1}
					if (nparams == 2) {cost=c2b; role=c2} 
					if (nparams == 3) {cost=c3b; role=c3} 
					if (nparams == 4) {cost=c4b; role=c4} 
					if (nparams == 5) {cost=c5b; role=c5} 
					if (nparams == 6) {cost=c6b; role=c6} 
					if (nparams == 7) {cost=c7b; role=c7} 
					if (nparams == 8) {cost=c8b; role=c8}
					if (nparams == 9) {cost=c9b}
					if (ubalance < cost) return message.author.send(`У вас на счету недостаточно денег`);
					ubalance = ubalance - cost;
					 connection.query(`UPDATE profile SET balance=${ubalance} WHERE idd=${message.author.id};`,
						function(err, results, fields) {
							if (err != null) {
								console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
							}
						}
					);
					if(nparams != 9) rUser.addRole(role);
					if(nparams == 9) {
						rUser.removeRole(c1);
						rUser.removeRole(c2);
						rUser.removeRole(c3);
						rUser.removeRole(c4);
						rUser.removeRole(c5);
						rUser.removeRole(c6);
						rUser.removeRole(c7);
						rUser.removeRole(c8);
					}
					let buying = new RichEmbed()
					.setColor(`#8B008B`)
					.setTitle('**[Магазин]**')
					.addField('**Пользователь**', `<@${message.author.id}>`, true)
					.addField('**Купил **', `${nparams} товар`, true)
					.setTimestamp()
					.setFooter('[MIRD BOT]');
					client.channels.get(config.commandch).send(buying);
				}
			);
		}
}