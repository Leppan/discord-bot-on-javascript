youtube();
function youtube() {
	message.delete();
	if (message.channel.id != config.commandch) return;
	request({
        method: 'GET',
        url: 'https://www.googleapis.com/youtube/v3/channels?part=statistics&id=UC6NXRdTtgiy4dGdCJRYIHHQ&key=AIzaSyC8J6d-DDqaN9NjVjdxdtcXiOleCbWgOGY'
    }, function (err, response, text) {
        if (err) return;
        var json = JSON.parse(text);

        let subs = json.items[0].statistics.subscriberCount;
	    let watch = json.items[0].statistics.viewCount
	    let videos = json.items[0].statistics.videoCount

	    const info = new Discord.RichEmbed()
		.setColor('#FF0000')
		.setTitle('**YOUTUBE - FROZE1**')
		.setDescription(`**Подписчиков:** ***${subs}***\n**Просмотров:** ***${watch}***\n**Всего видео:** ***${videos}***`)
		.setThumbnail('https://yt3.ggpht.com/a/AGF-l78BbC93ijkceP4QRsclWMvra8cbvGFRjOAzDg=s288-c-k-c0xffffffff-no-rj-mo')
		.setTimestamp()
		.setFooter('[MIRD BOT]');
		message.channel.send(info);
    });
}