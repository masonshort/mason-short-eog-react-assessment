import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { Card, CardContent, Typography } from '@mui/material';

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

interface Props {
  selected: string;
}

export function MetricCard({ selected }: Props) {
  const { loading, error, data } = useQuery<CurrentDataResponse>(GET_CURRENT, {
    variables: {
      metricName: selected,
    },
    pollInterval: 1000,
  });
  if (loading) return <div>Loading...</div>;
  if (!data || error) return <div>Error</div>;
  const { value } = data.getLastKnownMeasurement;
  return (
    <Card sx={{ width: 275, m: 10 }}>
      <CardContent>
        <Typography variant="h5" sx={{ fontSize: 18 }}>
          {selected}
        </Typography>
        <Typography>{value}</Typography>
      </CardContent>
    </Card>
  );
}
