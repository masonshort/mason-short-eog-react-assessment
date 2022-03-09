import React from 'react';
import { gql, useQuery } from '@apollo/client';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { FormControl, InputLabel, MenuItem } from '@mui/material';
import { Chart } from './Chart';
import { MetricCard } from './MetricCard';

const GET_METRICS = gql`
  query GetMetrics {
    getMetrics
  }
`;

interface Props {
  heartbeat: number;
}

export function GetMetrics({ heartbeat }: Props) {
  const { loading, error, data } = useQuery(GET_METRICS);
  const [selected, setSelected] = React.useState<string>('');

  function handleChange(event: SelectChangeEvent<typeof selected>) {
    const {
      target: { value },
    } = event;
    // this will be used if multi is used
    // setSelected(typeof value === 'string' ? value.split(', ') : value);
    setSelected(value);
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <FormControl sx={{ m: 3, width: 300 }}>
        <InputLabel>Metric</InputLabel>
        {/* removed multi */}
        <Select value={selected} onChange={handleChange}>
          {data.getMetrics.map((entry: string) => (
            <MenuItem key={entry} value={entry}>
              {entry}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selected !== '' ? <Chart selected={selected} heartbeat={heartbeat} /> : null}
      {selected !== '' ? <MetricCard selected={selected} /> : null}
    </div>
  );
}
