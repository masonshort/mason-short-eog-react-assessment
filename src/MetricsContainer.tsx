import React from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  FormControl, MenuItem, InputLabel, Select, SelectChangeEvent, Grid,
} from '@mui/material';
import { ImageList } from '@material-ui/core';
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
  cardRow: {
    width: '150%',
    height: '100%',
    float: 'left',
    marginRight: 10,
    flexFlow: 'row',
    flexWrap: 'nowrap',
    overflow: 'inherit',
    paddingBottom: 0,
  },
});

interface Props {
  heartbeat: number;
}

export function MetricsContainer({ heartbeat }: Props) {
  const classes = useStyles();
  const { loading, error, data } = useQuery(GET_METRICS);
  const [multiSelect, setMultiSelect] = React.useState<string[]>([]);

  const handleMultiChange = (event: SelectChangeEvent<string[]>) => {
    // eslint-disable-next-line implicit-arrow-linebreak
    const {
      target: { value },
    } = event;
    setMultiSelect(typeof value === 'string' ? value.split(', ') : value);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error Loading Page</p>;

  return (
    <div>
      <FormControl sx={{ m: 3, width: 300, height: 150 }}>
        <InputLabel className={classes.label} id="metric-label-id">
          Metric
        </InputLabel>
        <Select
          className={classes.input}
          multiple
          value={multiSelect}
          labelId="metric-label-id"
          onChange={handleMultiChange}
        >
          {data.getMetrics.map((entry: string) => (
            <MenuItem key={entry} value={entry}>
              {entry}
            </MenuItem>
          ))}
        </Select>
        <ImageList className={classes.cardRow}>
          {multiSelect.map((entry) => (
            <Grid item key={entry}>
              <MetricCard selected={entry} />
            </Grid>
          ))}
        </ImageList>
      </FormControl>
      {multiSelect?.length !== 0 ? <Chart selected={multiSelect} heartbeat={heartbeat} /> : null}
    </div>
  );
}
