chrome.runtime.onInstalled.addListener(() => {
	console.log('Extension SongLink Replacer installed');
});
// chrome.action.onClicked.addListener(async () => {
// 	await chrome.offscreen.createDocument({
// 		url: 'popup.html',
// 		reasons: ['CLIPBOARD'],
// 		justification: 'Write text to the clipboard.'
// 	});
// 	// Now that we have an offscreen document, we can dispatch the
// // message.
// 	chrome.runtime.sendMessage({
// 		action: 'copyLink',
// 		target:"offscreen"
// 	});
// });

chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
	  try {
		  if(message.action === 'resultLink') {}
		  if (message.url) {
			  const response = await fetch(message.url);
			  const data = await response.json();
			  
			  if (data.linksByPlatform && data.pageUrl) {
				  chrome.runtime.sendMessage({action: 'resultLink', url: data.pageUrl});
			  }
		  } else {
			  console.error('Pas d\'URL');
		  }
	  } catch (error) {
		  chrome.action.setBadgeText({text: '❌'});
		  console.error( error);
	  }
	  return true
  }
)

