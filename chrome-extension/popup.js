document.getElementById('replace-link').addEventListener('click', (e) => {
	readClipboard()
})

//Get message from background worker
chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
	if (message.action === 'resultLink') {
		if (message.url) {
			await navigator.clipboard.writeText(message.url);
			document.getElementById('infos').innerText = "✅ Url copiée !";
			setTimeout(()=>window.close(),500)
		}
	}
})

async function readClipboard() {
	try {
		document.getElementById('infos').innerText = "Lecture du presse-papier...";
		const text = await navigator.clipboard.readText();
		if (text) {
			const spotifyRegex = /https:\/\/open\.spotify\.com\/[a-zA-Z0-9\/]+/;
			const appleMusicRegex = /https:\/\/music\.apple\.com\/[a-zA-Z0-9\/]+/;
			
			let match = text.match(spotifyRegex) || text.match(appleMusicRegex);
			if (match) {
				const url = text;
				document.getElementById('infos').innerText = "Lien trouvé ! Remplacement...";
				const songLinkUrl = `https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent(url)}`;
				chrome.runtime.sendMessage({action: 'replaceLink', url: songLinkUrl});
			} else {
				document.getElementById('infos').classList.add("error")
				document.getElementById('infos').innerText = "Pas de lien Spotify ou Apple Music trouvé dans le" +
				  " presse-papier.";
				console.error('Pas de lien Spotify ou Apple Music trouvé dans le presse-papier.');
			}
		}
	} catch (error) {
		console.error('Erreur en lisant ou écrivant dans le presse-papier: ', error.message);
	}
	
}


