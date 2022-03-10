import React from 'react';
import { gql, useQuery } from '@apollo/client';
import LinearProgress from '@material-ui/core/LinearProgress';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  Label,
} from 'recharts';
import moment from 'moment';

const GET_MEASUREMENTS = gql`
  query GetMeasurements($metricName: String!, $after: Timestamp!) {
    getMeasurements(input: { metricName: $metricName, after: $after }) {
      metric
      value
      at
      unit
    }
  }
`;

function useMeasurementsQuery(selected: string, after: number) {
  return useQuery(GET_MEASUREMENTS, {
    variables: { metricName: selected, after },
    pollInterval: 1300,
  });
}

const formatXAxis = (value: number) => moment(new Date(value)).format('h:mm a');

interface ChartProps {
  selected: string;
  heartbeat: number;
}

export function Chart({ selected, heartbeat }: ChartProps) {
  const after = Math.round(heartbeat - 30 * 60000);

  const { loading, error, data } = useMeasurementsQuery(selected, after);

  if (loading) return <LinearProgress />;
  if (error || !data) return <p>Error: {error}</p>;

  const { getMeasurements } = data;

  return (
    <ResponsiveContainer width={1000} minWidth={500} aspect={16 / 9}>
      <LineChart
        width={1300}
        height={600}
        data={getMeasurements}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <Line isAnimationActive={false} type="natural" dataKey="value" dot={false} stroke="red" />
        <CartesianGrid strokeDasharray="5 5" />
        <Tooltip />
        <XAxis dataKey="at" minTickGap={25} tickFormatter={formatXAxis}>
          <Label value="Timestamp" position="insideBottomLeft" offset={-5} />
        </XAxis>
        <YAxis dataKey="value">
          <Label value="unit" position="insideTopLeft" offset={-5} />
        </YAxis>
        <Legend />
      </LineChart>
    </ResponsiveContainer>
  );
}
