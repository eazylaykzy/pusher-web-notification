import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';

// Override the default scope of '/' with './', so that the registration applies
// to the current directory and everything underneath it.

ReactDOM.render(
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <App/>
    </ThemeProvider>,
  document.getElementById('root')
);

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/service-worker.js').then(
    registered => console.log('We got it registered!')
  ).catch(err => {
    console.log('Could not register SW: ', err)
  });
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
