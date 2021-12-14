import { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { RunTestForm } from '../components/RunTestForm';
import { ShowTests } from '../components/ShowTests';
import { ShowResults } from '../components/ShowResults';
import { Heading, Grid } from '@chakra-ui/layout';

const Home: NextPage = () => {
  const columns = [0,1,2,3,4,5,6];
  const [list, setList] = useState({} as Record<number, any[]>);
  
  useEffect(() => {
    fetch(`/api/files/getFiles`,{
        method: 'POST',
    }).then(res => res.json())
    .then(res => {
        setList({
            ...columns.map(nb => {
                return nb == 0 ? [...res.files] : []
            })
        });
    })
  }, []);

  console.log({list})

  return (
    <div className={styles.container}>
      <Head>
        <title>Lighthouse scores</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Heading pt={8} pb={2}>Run tests</Heading>
        <RunTestForm />
        <Grid 
            gap={2} 
            templateColumns={`repeat(${columns.length}, 1fr)`}
            templateRows='repeat(3, 1fr)'
        >
          <ShowTests 
            columns={columns}
            list={list}
            setList={setList}
          />
          <ShowResults
            columns={columns}
            list={list}
          />
        </Grid>

      </main>
    </div>
  )
}

export default Home
