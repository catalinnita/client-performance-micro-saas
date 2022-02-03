import React, { useState } from 'react';
import { 
    Button,
    Grid,
    Input, 
    NumberInput, 
    NumberInputField, 
    NumberInputStepper, 
    NumberIncrementStepper, 
    NumberDecrementStepper,
    Spinner,
    Heading,
    Text, 
    Box,
    Textarea,
} from '@chakra-ui/react'

export interface IRunTestForm {
    callback: () => void
}

export function RunTestForm ({ callback }: IRunTestForm) {
    const [loading, setLoading] = useState(false)
    const [values, setValues] = useState({
        name: 'version1',
        url: 'http://localhost:3000/',
        times: 3,
    })

    const startTests = async () => {
        setLoading(true)
        fetch(`/api/postLighthouseReport`,{
            method: 'POST',
            body: JSON.stringify(values),
        }).then(res => {
            callback()
            setLoading(false)
        })
    }

    const sanitizeValues = () => {
        const { url, name, times } = values
        
        // clean up urls
        const urls = Array.from(new Set(url.split("\n")))
        const newUrls = urls.filter(currUrl => {
            
            // it must have at least 10 chars to be an url
            if (currUrl.length < 10) {
                return false
            } 

            // it is a valid url
            try {
                new URL(currUrl);
                return true
            } catch (_) {
                return false;  
            }

        })

        // loop through urls and assign names
        const newRawNames = name.split("\n")
        const newNames = newUrls.map((url, key) => {
            if (newRawNames[key]) {
                return newRawNames[key]
            } else {
                const currUrl = new URL(url)
                return `${currUrl.hostname}${currUrl.pathname.substr(1) ? `-${currUrl.pathname.substr(1)}` : ''}`
            }
        })

        setValues({
            name: newNames.join("\n"),
            url: newUrls.join("\n"),
            times,
        })
    }

    return (
        <Box 
            p={10}
            bg="white"
            borderRadius={12}
            border="1px solid var(--chakra-colors-gray-300)"
        >
            <Heading 
                pb={1}
                as="h1" 
                fontSize="30px"
                letterSpacing="-0.05em"
            >
                RUN LIGHTHOUSE TESTS
            </Heading>
            <Text pb={5}>
                Tests will be run for the number of times set and will be saved in separated .json files along with original traces.
            </Text>
  
            <Grid 
                gap={2} 
                templateColumns='2fr 2fr 1fr 1fr'
            >
                <Textarea 
                    onChange={(e) => {
                        setValues({
                            ...values, 
                            url: e.target.value,
                        })
                    }}
                    onBlur={() => {
                        sanitizeValues()
                    }}
                    type="url" 
                    name="url" 
                    value={values.url} 
                    height="100px" 
                />

                <Textarea 
                    height="100px" 
                    type="text" 
                    name="testName" 
                    value={values.name} 
                    onChange={(e) => {
                        setValues({
                            ...values, 
                            name: e.target.value,
                        })
                    }}
                    onBlur={() => {
                        sanitizeValues()
                    }}
                />
                
                <NumberInput 
                    alignSelf="start"
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

                <Button variant='outline' onClick={startTests}>{ loading ? <Spinner size='xs' /> : 'Run' }</Button>
            </Grid>
        </Box>
    );
}
