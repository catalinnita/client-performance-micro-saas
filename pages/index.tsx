import { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { RunTestForm } from '../components/RunTestForm';
import { ShowTests } from '../components/ShowTests';
import { ShowResults } from '../components/ShowResults';
import { Grid, Box } from '@chakra-ui/layout';
import { AddRemoveColumns } from '../components/AddRemoveColumns';

const LS_COLUMNS_NR = 'columnsNr'

const Home: NextPage = () => {
  const getColumnsNr = () => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem(LS_COLUMNS_NR) || '3')
    } 
    return 3
  }
  const [columnsNr, setColumnsNr] = useState(3)
  const [list, setList] = useState({} as Record<number, any[]>);
  
  const getFiles = () => {
    fetch(`/api/getFiles`, {
      method: 'POST',
    })
    .then(res => res.json())
    .then(res => {
        setList({
            ...Array.from(Array(columnsNr).keys()).map(column => {
                return column == 0 ? [...res.files] : []
            })
        });
    })
  } 

  useEffect(() => {
    getFiles()
    setColumnsNr(getColumnsNr())
  }, []);

  const setColumns = (columns: number) => {
    let newColumns = columns < 2 ? 2 : columns > 10 ? 10 : columns
    setColumnsNr(newColumns)
    localStorage.setItem(LS_COLUMNS_NR, newColumns.toString())
  }

  return (
    <>
      <Head>
        <title>Lighthouse scores</title>
        <meta name="description" content="Lighouse tests and comparison in no time" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box p={10} bg="white">

        <RunTestForm 
          callback={() => { getFiles() }}
        />

        <AddRemoveColumns 
          columnsNr={columnsNr}
          setColumns={setColumns}
        />
        
        <Grid 
            gap={2} 
            templateColumns={`repeat(${columnsNr}, 1fr)`}
            templateRows='repeat(2, auto)'
        >
          <ShowTests 
            columnsNr={columnsNr}
            list={list}
            setList={setList}
          />
          <ShowResults
            columnsNr={columnsNr}
            list={list}
          />
        </Grid>

      </Box>
    </>
  )
}

export default Home
