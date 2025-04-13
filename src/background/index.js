const setAlarm = () => {
  chrome.alarms.create('myAlarm', { periodInMinutes: 1 / 60 });
  console.log('Alarme criado!');

  chrome.alarms.getAll((alarms) => {
    console.log('Alarmas existentes:', alarms);
  });
};

chrome.runtime.onInstalled.addListener(setAlarm);
chrome.runtime.onStartup.addListener(setAlarm);


chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'myAlarm') {
    chrome.tabs.query({ url: '*://app.duotalk.io/*' }, (tabs) => {
      for (const tab of tabs) {
        if (tab.id) {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['src/content/index.js']
          }, () => {
            console.log(`Script executado na aba ${tab.id}`);
          });
        }
      }
    });
  }
});
