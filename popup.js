document.getElementById('replace-link').addEventListener('click', (e) => {
	// if(e.target.innerText !== 'Remplacer le lien'){
	// 	navigator.clipboard.writeText(e.target.value);
	// 	e.target.innerText = 'Lien copié !';
	// }
	readClipboard()
})
//Get message from background page
chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
	// if(message.action === 'copyLink'){
	// 	await readClipboard()
	// }
	if (message.action === 'resultLink') {
		if (message.url) {
			await navigator.clipboard.writeText(message.url);
			// chrome.action.setBadgeText({text: '✅'});
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
				// document.getElementById('replace-link').innerText = url;
				const songLinkUrl = `https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent(url)}`;
				chrome.runtime.sendMessage({action: 'replaceLink', url: songLinkUrl});
			} else {
				// chrome.action.setBadgeText({text: '❌'});
				document.getElementById('infos').classList.add("error")
				document.getElementById('infos').innerText = "Pas de lien Spotify ou Apple Music trouvé dans le" +
				  " presse-papier.";
				console.error('Pas de lien Spotify ou Apple Music trouvé dans le presse-papier.');
				// alert('Pas de lien Spotify ou Apple Music trouvé dans le presse-papier.');
			}
		}
	} catch (error) {
		// chrome.action.setBadgeText({text: '❌'});
		console.error('Erreur en lisant ou écrivant dans le presse-papier: ', error.message);
	}
	// window.close()
	
}

// window.onload = function () {
// 	// readClipboard()
// }


