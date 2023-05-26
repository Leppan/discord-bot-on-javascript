aregister();
function aregister() {
		message.delete();
	if (!message.member.roles.get(config.moderrole) && !message.member.roles.get(config.adminrole)) return message.author.send(`У вас недостаточно прав на выполнение данной команды!`);
	if (!params[1]) return message.author.send(`Вы не указали пользователя`);
	    var rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(params[1]));
	if (!rUser) return message.author.send("Пользователь не найден");

	connection.query(`SELECT * FROM profile WHERE idd=${rUser.user.id};`,
		function(err, results, fields) {
			if (err != null) {
				console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
			}
			if (results.length == 0) {
				connection.query(`INSERT INTO profile (name, idd, onserver, reamute, timemute, warns, reawarn1, reawarn2, reawarn3, reawarn4, reawarn5, balance, lvl) VALUES ('${rUser.user.username}', '${rUser.user.id}', '1', '', '', '0', 'Нет', 'Нет', 'Нет', 'Нет', 'Нет', 10000, 0);`,
					function(err, results, fields) {
						if (err != null) {
							console.log(info(` [MIRD] Result insert to BD: ${results} Err: ${err}`))
						}
						console.log(warning(` Участник ${rUser.user.id} был инициализирован администратором`));
						message.author.send(`Вами добавлен новый пользователь`)
					}
				);
				if (config.joinroleenable == true) { 
					rUser.addRole(message.guild.roles.find(x => x.name === config.joinrole)); 
				}
			}
		}
	);
}