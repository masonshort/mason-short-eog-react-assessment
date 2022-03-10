import React from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import { Chart } from './components/Chart';
import { MetricCard } from './components/MetricCard';

const GET_METRICS = gql`
  query GetMetrics {
    getMetrics
  }
`;

const useStyles = makeStyles({
  input: {
    margin: '0 0 0 0',
  },
  label: {
    backgroundColor: 'rgb(226,231,238)',
    margin: '10',
  },
  form: {
    maxHeight: '20%',
    maxWidth: '25%',
  },
});

interface Props {
  heartbeat: number;
}

export function MetricsContainer({ heartbeat }: Props) {
  const classes = useStyles();
  const { loading, error, data } = useQuery(GET_METRICS);
  const [selected, setSelected] = React.useState<string>('');

  const handleChange = ({ target }: SelectChangeEvent<string>) => setSelected(target.value);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <FormControl sx={{ m: 3, width: 300 }}>
        <InputLabel className={classes.label} id="metric-label-id">
          Metric
        </InputLabel>
        <Select className={classes.input} labelId="metric-label-id" value={selected} onChange={handleChange}>
          {data.getMetrics.map((entry: string) => (
            <MenuItem key={entry} value={entry}>
              {entry}
            </MenuItem>
          ))}
        </Select>
        {selected !== '' ? <MetricCard selected={selected} /> : null}
      </FormControl>
      {selected !== '' ? <Chart selected={selected} heartbeat={heartbeat} /> : null}
    </div>
  );
}
