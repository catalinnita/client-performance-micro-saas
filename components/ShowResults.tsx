import React from 'react'
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
        'DOM Size': (data) => data["dom-size"]["numericValue"],
    },
    'Main Thread': {
        'Main Thread': (data) => data["mainthread-work-breakdown"]["numericValue"],
        'Script Evaluation': (data) => data["mainthread-work-breakdown"]["details"]["items"].filter((item: any) => item.group === "scriptEvaluation")[0]['duration'],
        'Parse HTML': (data) => data["mainthread-work-breakdown"]["details"]["items"].filter((item: any) => item.group === "parseHTML")[0]['duration'],   
        'Style Layout': (data) => data["mainthread-work-breakdown"]["details"]["items"].filter((item: any) => item.group === "styleLayout")[0]['duration'],   
        'Rendering': (data) => data["mainthread-work-breakdown"]["details"]["items"].filter((item: any) => item.group === "paintCompositeRender")[0]['duration'],   
    },
    'NextJs': {
        'NextJs Before Hydration': (data) => data["user-timings"]["details"]["items"].filter((item: any) => item.name === "Next.js-before-hydration")[0]['duration'],
        'NextJs Hydration': (data) => data["user-timings"]["details"]["items"].filter((item: any) => item.name === "Next.js-hydration")[0]['duration'],
        'Before Render (start time)': (data) => data["user-timings"]["details"]["items"].filter((item: any) => item.name === "beforeRender")[0]['startTime'],
        'After Hydrate (start time)': (data) => data["user-timings"]["details"]["items"].filter((item: any) => item.name === "afterHydrate")[0]['startTime'],
    },
    'Resources (transfer size - in bytes)': {
        'Document': (data) => data["resource-summary"]["details"]["items"].filter((item: any) => item.resourceType === "document")[0]['transferSize'],
        'Script': (data) => data["resource-summary"]["details"]["items"].filter((item: any) => item.resourceType === "script")[0]['transferSize'],
        'Stylesheet': (data) => data["resource-summary"]["details"]["items"].filter((item: any) => item.resourceType === "stylesheet")[0]['transferSize'],
        'Image': (data) => data["resource-summary"]["details"]["items"].filter((item: any) => item.resourceType === "image")[0]['transferSize'],
        'Font': (data) => data["resource-summary"]["details"]["items"].filter((item: any) => item.resourceType === "font")[0]['transferSize'],
        'Media': (data) => data["resource-summary"]["details"]["items"].filter((item: any) => item.resourceType === "media")[0]['transferSize'],
        'Other': (data) => data["resource-summary"]["details"]["items"].filter((item: any) => item.resourceType === "other")[0]['transferSize'],
        'Total': (data) => data["resource-summary"]["details"]["items"].filter((item: any) => item.resourceType === "total")[0]['transferSize'],
        'Third party': (data) => data["resource-summary"]["details"]["items"].filter((item: any) => item.resourceType === "third-party")[0]['transferSize'],
    }
} as Record<string, Record<string, (data: Record<string, any>) => string>>

export interface IShowTests {
    columnsNr: number,
    list: Record<string, any[]>,
}

export function ShowResults ({list, columnsNr}: IShowTests) {
    return (
    <>
        {Array.from(Array(columnsNr).keys()).map((column) => 
            (
                column === 0 ? 
                <Box key={column} fontSize="12px">
                    <Box p={3} borderBottom="2px solid #ccc" fontSize="14px" fontWeight="700">&nbsp;</Box>
                    <Box p={3} borderBottom="2px solid #ccc" fontWeight="700">Metrics</Box>
                    {Object.keys(mapping).map((categoryName: string) => 
                        <>
                            <Box p={3} pt={6} borderBottom="2px solid #ccc" fontWeight="500">{ categoryName }</Box>
                            { Object.keys(mapping[categoryName]).map(metricName => 
                                <Box p={3} borderBottom="1px solid #ddd" key={metricName} fontSize="11px" fontWeight="400">{ metricName }</Box>
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
