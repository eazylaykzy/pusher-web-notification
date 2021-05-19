import {useState, useEffect, useRef} from "react";
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import * as PusherPushNotifications from "@pusher/push-notifications-web";
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Noti from './notify.mp3';

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
  const [notification, setNotification] = useState({title: '', body: ''});
  const [isTokenFound, setTokenFound] = useState({found: false, token: ''});

  // This is necessary for for all browsers, it will enable user interaction with the audio, and push notification,
  // I think thee best way to implement this is to call it on the admin `login` button, there the admin will either
  // allow or deny access to push notifications and sounds.
  const enableNotification = () => {
    beamsClient.start().then(() => {
      notiRef.current.click();
    });
  }

  useEffect(() => {
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
  }, [notification]);

  navigator.serviceWorker.addEventListener('message', async event => {
    setNotification({...event.data.notification});
    setShow(true);
    notiRef.current.play();
  });

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
