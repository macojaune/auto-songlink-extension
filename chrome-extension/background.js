chrome.runtime.onMessage.addListener(async function (message) {
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

