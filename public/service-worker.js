importScripts("https://js.pusher.com/beams/service-worker.js");

/*self.addEventListener('message', event => {
  console.log('SW');
  event.postMessage({message: 'Test from SW'})
});*/

self.addEventListener('message', event => {
  console.log('Skipping');
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

addEventListener('fetch', event => {
  event.waitUntil(async function() {
    // Exit early if we don't have access to the client.
    // Eg, if it's cross-origin.
    if (!event.clientId) return;
    console.log('event from SW: ', event);
    console.log('event.clients: ', event.clients);

    // Get the client.
    const client = await clients.get(event.clientId);
    // Exit early if we don't get the client.
    // Eg, if it closed.
    if (!client) return;

    /*await clients.matchAll().then(clients => {
      console.log(`Got into the client.matchAll inner: ${clients}`);
      clients.forEach(client => client.postMessage({msg: 'Hello from SW1'}));
    })*/

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
      // payload.notification.title = "A new title!";
      console.log('After calling CLIENTS!!!')
      client.postMessage(payload);
      pushEvent.waitUntil(handleNotification(payload));
      /*pushEvent.waitUntil(
        self.registration.showNotification(payload.notification.title, {
          body: payload.notification.body,
          icon: payload.notification.icon,
          data: payload.data,
        })
      );*/
    }
  }());
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});
