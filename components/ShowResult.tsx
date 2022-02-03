import React, { useEffect, useState } from 'react'
import { 
    Grid,
    Box,
    Input,
} from '@chakra-ui/react'
import { median } from 'math-stats'

export interface IShowTests {
    files: string[],
    mapping: Record<string, any>
}

export function ShowResult ({files, mapping}: IShowTests) {
    const [data, setData] = useState([] as Record<string, any>[]);
    const [borders, setBorders] = useState({} as Record<string, any>);
    const filesLength = files && files.length || 0
    
    // lousy hack to trigger useEffect if the order of elements inside the array changes
    const arrayString = JSON.stringify(files)

    const setResults = async (files: string[]) => {
        const getFiles = [] as Promise<any>[]
        files.forEach(file => {
            getFiles.push(
                fetch(`/api/getFile`, {
                    method: 'POST',
                    body: JSON.stringify({
                        file
                    })
                }).then(res => res.json())
            )
        })

        Promise.all([...getFiles]).then(resData => {
            setData(resData)
        })
    }

    const toggleBorder = (index, metricName) => {
        setBorders({
            ...borders,
            [`${metricName}-${index}`]: !borders?.[`${metricName}-${index}`]
        })
    }

    useEffect(() => {
        if  (filesLength > 0) {
            setResults(files)
        } else {
            setData([])
        }
    }, [files, filesLength, arrayString])    
    
    const columnsNumber = data.length > 1 ? data.length + 1 : data.length;

    return (
        <Grid fontSize="12px" templateColumns={`repeat(${columnsNumber}, 1fr)`}>
            <Box gridColumn="1 / -1" borderBottom="2px solid #ccc" >
                <Input type="text" fontSize="14px" fontWeight="700" height="45px"  p={3} border="0"/>
            </Box>
            {Object.values(data).map((data, index) => 
                <Box key={`data-${index}`}>
                    <Box p={3}  borderBottom="2px solid #ccc" textAlign="right" fontWeight="700">R{index}</Box>
                    {Object.keys(mapping).map(categoryName =>
                        <>
                            <Box p={3} pt={6} borderBottom="2px solid #ccc">&nbsp;</Box>
                            { Object.keys(mapping[categoryName]).map(metricName => {
                                const getMetric = mapping[categoryName][metricName]
                                return <Box 
                                    onClick={(e) => { toggleBorder(index, metricName) }} 
                                    outline={ borders?.[`${metricName}-${index}`] ? '2px solid black' : ''} 
                                    key={metricName} 
                                    p={3} 
                                    textAlign="right"
                                    borderBottom="1px solid #ddd"  
                                    fontSize="11px" 
                                    fontWeight="400"
                                >{
                                    Math.ceil(getMetric(data))
                                }</Box>
                            })}
                        </>
                    )}
                </Box>
            )}

            {columnsNumber > 1 && <Box>
                <Box bg='#efefef' p={3} borderBottom="2px solid #ccc" fontWeight="700">Median</Box>
                {Object.keys(mapping).map(categoryName =>
                        <>
                            <Box p={3} pt={6} borderBottom="2px solid #ccc">&nbsp;</Box>
                            {Object.keys(mapping[categoryName]).map(metricName => {
                                const getMetric = mapping[categoryName][metricName]
                                return <Box 
                                    key={metricName} 
                                    bg='#efefef' 
                                    p={3} 
                                    borderBottom="1px solid #ddd"  
                                    fontSize="11px" 
                                    fontWeight="400"
                                    textAlign="right"
                                    onClick={(e) => { toggleBorder('median', metricName) }} 
                                    outline={ borders?.[`${metricName}-median`] ? '2px solid black' : ''} 
                                >{
                                    median(
                                        Object.values(data).map((data) => 
                                            Math.ceil(getMetric(data))
                                        )
                                    )
                                }</Box>
                            })}
                        </>
                )}
            </Box>}
            
        </Grid>
    );
}
