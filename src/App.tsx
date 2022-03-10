import React from 'react';
import { ToastContainer } from 'react-toastify';
import { gql, useQuery } from '@apollo/client';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Wrapper from './components/Wrapper';
import { MetricsContainer } from './MetricsContainer';

const theme = createTheme({
  palette: {
    primary: {
      main: 'rgb(39,49,66)',
    },
    secondary: {
      main: 'rgb(197,208,222)',
    },
    background: {
      default: 'rgb(226,231,238)',
    },
  },
});

const GET_HEARTBEAT = gql`
  query GetHeartbeat {
    heartBeat
  }
`;

export function App() {
  const { loading, error, data } = useQuery(GET_HEARTBEAT);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Wrapper>
        <Header />
        <MetricsContainer heartbeat={data.heartBeat} />
        <ToastContainer />
      </Wrapper>
    </MuiThemeProvider>
  );
}
