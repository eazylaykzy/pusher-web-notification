import {useState, useEffect, useRef} from "react";
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import * as PusherPushNotifications from "@pusher/push-notifications-web";
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Noti from './notify.mp3';

// Override the default scope of '/' with './', so that the registration applies
// to the current directory and everything underneath it.
navigator.serviceWorker.register('service-worker.js', {scope: './'}).then(function(registration) {
  // At this point, registration has taken place.
  // The service worker will not handle requests until this page and any
  // other instances of this page (in other tabs, etc.) have been
  // closed/reloaded.
  document.querySelector('#register').textContent = 'succeeded';
  console.log('Succeeded')

  var serviceWorker;
  if (registration.installing) {
    serviceWorker = registration.installing;
    console.log(`installing: ${serviceWorker}`)
  } else if (registration.waiting) {
    serviceWorker = registration.waiting;
    console.log(`waiting: ${serviceWorker}`)
  } else if (registration.active) {
    serviceWorker = registration.active;
    console.log(`active: ${serviceWorker}`)
  }
}).catch(function(error) {
  // Something went wrong during registration. The service-worker.js file
  // might be unavailable or contain a syntax error.
  console.log(`Failed: ${error}`)
});

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const beamsClient = new PusherPushNotifications.Client({
  instanceId: '76ece59f-2e35-4a46-9312-dca21a79df99',
});

function App() {
  const notiRef = useRef();
  const [show, setShow] = useState(false);
  const [enableNotifications, setEnableNotifications] = useState(false);
  const [notification, setNotification] = useState({title: '', body: ''});
  const [isTokenFound, setTokenFound] = useState({found: false, token: ''});

  // This is necessary for Firefox, Brave and Safari
  const enableNotification = () => {
    beamsClient.start().then(() => {
      notiRef.current.click();
      setEnableNotifications(true)
      console.log("Registered with beams!");
    });
  }

  useEffect(() => {
    // Check if push messaging is supported, this will make the app not
    // to crash on Safari or any other non-supported browsers.
    // if (('PushManager' in window)) {
      beamsClient.start()
        .then((beamsClient) => beamsClient.getDeviceId())
        .then((deviceId) => {
          console.log("Successfully registered with Beams. Device ID:", deviceId);
          return setTokenFound({found: true, token: deviceId});
        })
        .then(() => beamsClient.addDeviceInterest("trades"))
        .then(() => beamsClient.getDeviceInterests())
        .then((interests) => console.log("Current interests:", interests))
        .catch(console.error);
    // }
  }, [enableNotifications, notification]);

  navigator.serviceWorker.addEventListener('message', async event => {
    console.log('event.data: ', event.data);
    setNotification({...event.data.notification});
    setShow(true);
    notiRef.current.play();
  });

  console.log('navigator.serviceWorker: ', navigator.serviceWorker);
  console.log('navigator.serviceWorker.controller: ', navigator.serviceWorker.controller);

  /*navigator.serviceWorker.onmessage = async (event) => {
    console.log('We dey here!!!');
    const data = await event.data;
    console.log('Data: ', data);
  }*/

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <div>
          <Button onClick={enableNotification}>Enable Notification</Button>
          <Button onClick={() => {
            notiRef.current.play();
            setShow(true);
          }}>Top-Left | Play Noti</Button>
          <audio ref={notiRef} src={Noti}/>
          <Snackbar
            autoHideDuration={6000}
            anchorOrigin={{vertical: 'top', horizontal: 'left'}}
            open={show}
            onClose={() => setShow(false)}
            message={notification.body}
            key={isTokenFound.token}
          />
        </div>

        <header className="App-header">
          {isTokenFound.found && <h1> Notification permission enabled 👍🏻 </h1>}
          {!isTokenFound.found && <h1> Need notification permission ❗️ </h1>}
        </header>
        <Copyright/>
      </Box>
    </Container>
  );
}

export default App;
