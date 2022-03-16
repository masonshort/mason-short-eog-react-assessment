import React from 'react';
import { gql, useQuery } from '@apollo/client';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Card, CardContent, Typography } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';

const GET_CURRENT = gql`
  query GetCurrent($metricName: String!) {
    getLastKnownMeasurement(metricName: $metricName) {
      value
    }
  }
`;

type CurrentData = {
  value: string;
};

type CurrentDataResponse = {
  getLastKnownMeasurement: CurrentData;
};

const useStyles = makeStyles({
  card: {
    margin: '5% 0% 0% 0%',
    width: 200,
    height: 100,
    paddingBottom: 0,
  },
});

function useCurrentData(selected: string) {
  return useQuery<CurrentDataResponse>(GET_CURRENT, {
    variables: {
      metricName: selected,
    },
    pollInterval: 1300,
  });
}

interface Props {
  selected: string;
}

export function MetricCard({ selected }: Props) {
  const classes = useStyles();

  const { loading, error, data } = useCurrentData(selected);

  if (loading) return <LinearProgress />;
  if (!data || error) {
    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h5" sx={{ fontSize: 18 }}>
            Error Recieving Data
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const { value } = data.getLastKnownMeasurement;
  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h5" sx={{ fontSize: 18 }}>
          {selected}
        </Typography>
        <Typography>Latest Value: {value}</Typography>
      </CardContent>
    </Card>
  );
}
