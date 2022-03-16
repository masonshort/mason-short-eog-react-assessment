import React from 'react';
import { gql, useQuery } from '@apollo/client';
import LinearProgress from '@material-ui/core/LinearProgress';
import {
  ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip, Label,
} from 'recharts';
import moment from 'moment';

const GET_MULTI_MEASUREMENTS = gql`
  query GetMultiMeasurements($selected: [MeasurementQuery]) {
    getMultipleMeasurements(input: $selected) {
      metric
      measurements {
        unit
        value
        at
      }
    }
  }
`;

function useMultiMeasurementsQuery(selected: MeasurementQuery[]) {
  return useQuery(GET_MULTI_MEASUREMENTS, {
    variables: { selected },
    pollInterval: 1300,
  });
}

const formatTime = (value: number) => moment(new Date(value)).format('h:mm a');

type MeasurementQuery = {
  metricName: string;
  after: number;
};

interface ChartProps {
  selected: any[];
  heartbeat: number;
}

export function Chart({ selected, heartbeat }: ChartProps) {
  // requests the last 10 minutes of data
  const after = Math.round(heartbeat - 10 * 60000);
  const [mQuery, setMQuery] = React.useState<MeasurementQuery[]>([{ metricName: '', after }]);

  React.useEffect(() => {
    setMQuery(selected.map((entry) => ({ metricName: entry, after })));
  }, [selected, after]);

  const { loading, error, data } = useMultiMeasurementsQuery(mQuery);

  if (loading) return <LinearProgress />;
  if (error || !data) return <p>Error: {error}</p>;

  const { getMultipleMeasurements } = data;

  return (
    <ResponsiveContainer width={1200} minWidth={500} aspect={16 / 9}>
      <LineChart
        width={1300}
        height={600}
        margin={{
          top: 20,
          right: 30,
          left: 30,
          bottom: 5,
        }}
      >
        <Line
          isAnimationActive={false}
          data={getMultipleMeasurements[0].measurements}
          type="natural"
          dataKey="value"
          name={getMultipleMeasurements[0].metric}
          dot={false}
          unit={getMultipleMeasurements[0].measurements[0].unit}
          stroke="red"
        />
        {getMultipleMeasurements[1] ? (
          <Line
            isAnimationActive={false}
            data={getMultipleMeasurements[1].measurements}
            type="natural"
            dataKey="value"
            name={getMultipleMeasurements[1].metric}
            width={1300}
            dot={false}
            unit={getMultipleMeasurements[1].measurements[0].unit}
            stroke="green"
          />
        ) : null}
        {getMultipleMeasurements[2] ? (
          <Line
            isAnimationActive={false}
            data={getMultipleMeasurements[2].measurements}
            type="natural"
            dataKey="value"
            name={getMultipleMeasurements[2].metric}
            width={1300}
            dot={false}
            unit={getMultipleMeasurements[2].measurements[0].unit}
            stroke="purple"
          />
        ) : null}
        {getMultipleMeasurements[3] ? (
          <Line
            isAnimationActive={false}
            data={getMultipleMeasurements[3].measurements}
            type="natural"
            name={getMultipleMeasurements[3].metric}
            dataKey="value"
            width={1300}
            dot={false}
            unit={getMultipleMeasurements[3].measurements[0].unit}
            stroke="black"
          />
        ) : null}
        {getMultipleMeasurements[4] ? (
          <Line
            isAnimationActive={false}
            data={getMultipleMeasurements[4].measurements}
            type="natural"
            name={getMultipleMeasurements[4].metric}
            dataKey="value"
            width={1300}
            dot={false}
            unit={getMultipleMeasurements[4].measurements[0].unit}
            stroke="orange"
          />
        ) : null}
        {getMultipleMeasurements[5] ? (
          <Line
            isAnimationActive={false}
            data={getMultipleMeasurements[5].measurements}
            type="natural"
            name={getMultipleMeasurements[5].metric}
            dataKey="value"
            width={1300}
            dot={false}
            unit={getMultipleMeasurements[5].measurements[0].unit}
            stroke="blue"
          />
        ) : null}
        <CartesianGrid strokeDasharray="5 5" />
        <Tooltip labelFormatter={(value: number) => formatTime(value)} />
        <XAxis dataKey="at" minTickGap={25} allowDuplicatedCategory={false} tickFormatter={formatTime}>
          <Label value="Timestamp" position="insideBottomLeft" offset={-5} />
        </XAxis>
        <YAxis dataKey="value">
          <Label value="Unit" position="insideTopLeft" offset={-5} />
        </YAxis>
        <Legend />
      </LineChart>
    </ResponsiveContainer>
  );
}
