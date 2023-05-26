roll();
function roll() {
	message.delete();
	if (message.channel.id != config.commandch) return;
	if (!params[1]) return message.author.send(`Вы не ввели сумму, на которую хотите сыграть`);

	connection.query(`SELECT * FROM profile WHERE idd=${message.author.id};`,
		function(err, results, fields) {
			if (err != null) {
				console.log(info(` [MIRD] Result rq bd in roll: ${results} Err: ${err}`))
			}
			var rsqs = Object.keys(results).length;
			if(rsqs != 0) {
				let sum = params[1];
				if (sum < 100) return message.author.send(`Минимальная сумма для игры 100 коинов`) 
				if (isNaN(sum)) return message.author.send(`Нужно написать число`);
				let prof = results[0];
				let balance = prof.balance;
				let min = 1;
				let max = 7;
			    let number = Math.round(Math.random()*(max-min)+min);
			    if (sum > balance) return message.author.send(`У Вас нет данной суммы`)
			    if(number < 4) {
			        balance = Number.parseInt(balance);
			        sum = Number.parseInt(sum);
			        balance = balance + sum;
			        let embed = new RichEmbed()
					.setColor('#7B68EE')
					.setTitle('**[Рулетка]**')
					.setDescription(`
					    Поздравляем ***<@${message.author.id}>***, который выиграл в рулетке ***${sum} коинов***
					    `)
					.setTimestamp()
					.setFooter('[MIRD BOT]');
					message.channel.send(embed);
					connection.query(`UPDATE profile SET balance=${balance} WHERE idd=${message.author.id};`,
						function(err, results, fields) {
						  	if (err != null) {	
						  		console.log(info(` [MIRD] Result off user in BD: ${results}  Err: ${err}`))
						  	}
						}
					);
			    }
			         
			    if (number > 4) {
			        balance = Number.parseInt(balance);
			        sum = Number.parseInt(sum);
			        balance = balance - sum;
			        let embed = new RichEmbed()
					.setColor('#7B68EE')
					.setTitle('**[Рулетка]**')
					.setDescription(`
					    Увы но ***<@${message.author.id}>*** проиграл в рулетке ***${sum} коинов***
					`)
					.setTimestamp()
					.setFooter('[MIRD BOT]');
					message.channel.send(embed);
					connection.query(`UPDATE profile SET balance=${balance} WHERE idd=${message.author.id};`,
						function(err, results, fields) {
						  	if (err != null) {	
						  		console.log(info(` [MIRD] Result off user in BD: ${results}  Err: ${err}`))
						  	}
						}
					);		        	
			    }
			} else {
			    message.author.send(`Ваш профиль не был найден в базе данных, обратитесь к администратору`)
			}
		}
	);
}