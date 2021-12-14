import React, { useState } from 'react';
import { 
    Button,
    Grid,
    Input, 
    NumberInput, 
    NumberInputField, 
    NumberInputStepper, 
    NumberIncrementStepper, 
    NumberDecrementStepper 
} from '@chakra-ui/react'

export interface IRunTestForm {
}

export function RunTestForm (props: IRunTestForm) {
    const [values, setValues] = useState({
        name: 'version1',
        url: 'http://localhost:3000/',
        times: 3,
    })

    const stopLoading = () => {

    }

    const startLoading = () => {

    }

    const startTests = async () => {
        startLoading();
        fetch(`/api/web-vitals`,{
            method: 'POST',
            body: JSON.stringify(values),
        }).then(res => {
            stopLoading();
        })
    }

    console.log({values})

    return (
    <Grid 
        gap={2} 
        templateColumns='2fr 2fr 1fr 1fr'
    >
        <Input 
            type="text" 
            name="testName" 
            value={values.name} 
            onChange={(e) => {
                setValues({
                    ...values, 
                    name: e.target.value,
                })
            }}
        />

        <Input 
            type="url" 
            name="url" 
            value={values.url} 
            onChange={(e) => {
                setValues({
                    ...values, 
                    url: e.target.value,
                })
            }}
        />
        
        <NumberInput 
            name="numberOfTimes" 
            defaultValue={values.times}
            min={1}
            max={10}
            onChange={(value) => {
                setValues({
                    ...values, 
                    times: parseInt(value),
                })
            }}
        >
            <NumberInputField />
            <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
            </NumberInputStepper>
        </NumberInput>

        <Button onClick={startTests}>Run</Button>
    </Grid>
    );
}
