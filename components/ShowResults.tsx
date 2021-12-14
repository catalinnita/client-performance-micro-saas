import React, { useEffect, useState } from 'react'
import { Box } from '@chakra-ui/react'
import { ShowResult } from './ShowResult'

const mapping = {
    'Web Vitals': {
        'FCP': (data) => data["first-contentful-paint"]["numericValue"],
        'LCP': (data) => data["largest-contentful-paint"]["numericValue"],
        'CLS': (data) => data["cumulative-layout-shift"]["numericValue"],
        'SI': (data) => data["speed-index"]["numericValue"],
        'TTI': (data) => data["interactive"]["numericValue"],
        'TBT': (data) => data["total-blocking-time"]["numericValue"],
        'TTFB': (data) => data["server-response-time"]["numericValue"],
        'Script Execution': (data) => data["bootup-time"]["numericValue"],
    },
    'Main Thread': {
        'Main Thread': (data) => data["mainthread-work-breakdown"]["numericValue"],
        'Script Evaluation': (data) => data["mainthread-work-breakdown"]["details"]["items"].filter(item => item.group === "scriptEvaluation")[0]['duration'],
        'Style Layout': (data) => data["mainthread-work-breakdown"]["details"]["items"].filter(item => item.group === "styleLayout")[0]['duration'],   
    },
    'NextJs': {
        'NextJs Before Hydration': (data) => data["user-timings"]["details"]["items"].filter(item => item.name === "Next.js-before-hydration")[0]['duration'],
        'NextJs Hydration': (data) => data["user-timings"]["details"]["items"].filter(item => item.name === "Next.js-hydration")[0]['duration'],
        'Before Render (start time)': (data) => data["user-timings"]["details"]["items"].filter(item => item.name === "beforeRender")[0]['startTime'],
        'After Hydrate (start time)': (data) => data["user-timings"]["details"]["items"].filter(item => item.name === "afterHydrate")[0]['startTime'],
    },
} as Record<string, Record<string, (data: Record<string, any>) => string>>

export interface IShowTests {
    columns: number[],
    list: Record<string, any[]>,
}

export function ShowResults ({list, columns}: IShowTests) {
    console.log({ list })

    return (
    <>
        {columns.map((column) => 
            (
                column === 0 ? 
                <Box key={column} fontSize="12px">
                    <Box p={3} borderBottom="2px solid #ccc" fontSize="14px" fontWeight="700">&nbsp;</Box>
                    <Box p={3} borderBottom="2px solid #ccc" fontWeight="700">Metrics</Box>
                    {Object.keys(mapping).map((categoryName: string) => 
                        <>
                            <Box p={3} pt={6} borderBottom="2px solid #ccc" fontWeight="500">{ categoryName }</Box>
                            { Object.keys(mapping[categoryName]).map(metricName => 
                                <Box p={3} borderBottom="1px solid #ddd" key={metricName} fontSize="11px" fontWeight="400">{metricName}</Box>
                            )}
                        </>
                    )}
                </Box> :
                <ShowResult key={column} mapping={mapping} files={list[column]} />
                
            )
        )}
    </>
    );
}
