importScripts("https://js.pusher.com/beams/service-worker.js");

self.addEventListener('install', event => {
  console.log('Installed');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Activated');
  // event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
  event.waitUntil(async function() {
    // Exit early if we don't have access to the client.
    // Eg, if it's cross-origin.
    if (!event.clientId) return;

    // Get the client.
    const client = await clients.get(event.clientId);
    // Exit early if we don't get the client.
    // Eg, if it closed.
    if (!client) return;
    console.log('!client: ', client);

    // Send a message to the client.
    PusherPushNotifications.onNotificationReceived = ({
                                                        pushEvent,
                                                        payload,
                                                        handleNotification,
                                                      }) => {
      // Your custom notification handling logic here 🛠️
      // This method triggers the default notification handling logic offered by
      // the Beams SDK. This gives you an opportunity to modify the payload.
      // E.g. payload.notification.title = "A client-determined title!"
      console.log('After calling CLIENTS!!! payload: ', payload);
      client.postMessage(payload);
      pushEvent.waitUntil(handleNotification(payload));
      console.log('After ALL CLIENTS!!! payload: ', payload);
    }
  }());
});
