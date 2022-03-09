import React from 'react';
import { gql, useQuery } from '@apollo/client';
import LinearProgress from '@material-ui/core/LinearProgress';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from 'recharts';
import moment from 'moment';

// const GET_MULTI_MEASUREMENTS = gql`
//   query GetMultiMeasurements {
//     getMultipleMeasurements(input: [{ metricName: "waterTemp" }, { metricName: "oilTemp" }]) {
//       metric
//       measurements {
//         value
//         at
//         unit
//       }
//     }
//   }
// `;

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

// const LineColors = {
//   tubingPressure: 'green',
//   waterPressure: 'blue',
//   flareTemp: 'red',
//   oilTemp: 'black',
//   casingPressure: 'magenta',
//   injValveOpen: 'purple',
// };

// type GetMeasurementsData = {
//   metric: string;
//   value: string;
//   at: number;
//   unit: string;
// };

// type GetMeasurementsResponse = {
//   getMeasurements: [GetMeasurementsData];
// };

interface ChartProps {
  selected: string;
  heartbeat: number;
}

export function Chart({ selected, heartbeat }: ChartProps) {
  const after = Math.round(heartbeat - 30 * 60000);
  const { loading, error, data } = useQuery(GET_MEASUREMENTS, {
    variables: { metricName: selected, after },
    pollInterval: 1000,
  });

  function formatXAxis(value: number) {
    return moment(value).format('h:mm a');
    // return new Date(value).toLocaleString('en-US', { hour: 'numeric' });
  }

  if (loading) return <LinearProgress />;
  if (error || !data) return <p>Error: {error}</p>;

  const { getMeasurements } = data;
  console.log(getMeasurements);

  return (
    <ResponsiveContainer width={1000} minWidth={500} aspect={16 / 9}>
      <LineChart
        width={1300}
        height={600}
        data={getMeasurements}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <Line isAnimationActive={false} type="natural" dataKey="value" dot={false} stroke="red" />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <XAxis dataKey="at" tickFormatter={formatXAxis} interval="preserveStartEnd" minTickGap={100} />
        <YAxis dataKey="value" label={data.unit} />
        <Legend />
      </LineChart>
    </ResponsiveContainer>
  );
}
