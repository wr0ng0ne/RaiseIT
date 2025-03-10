import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

const styles = {
  global:(props)=>({
    body:{
      color:mode('gray.800','whiteAlpha.900')(props),
      bg:mode('gray.100','#101010')(props),
    }
  })
};

const config = {
  initialColorMode: "dark",
  useSystemColorMode: true
};

const colors = {
  grey:{
    light: "#616161",
    dark: "#1e1e1e"
  }
};

const theme = extendTheme({config, styles, colors});

ReactDOM.createRoot(document.getElementById('root')).render(
//React.StrictMode renders every components twice, on development
  <React.StrictMode>
    <RecoilRoot>
    <BrowserRouter>
    <ChakraProvider theme={theme}>
    <App />
    </ChakraProvider>
    </BrowserRouter>
    
    </RecoilRoot>
  </React.StrictMode>
);
