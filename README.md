# client-performance-micro-saas

Curently a tool for running lighthouse lab tests and calculate median of multiple results and generate reports for dev docs.

## Demo

https://client-performance-micro-saas.vercel.app/

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3999](http://localhost:3999) with your browser to see the result.


## Configure

* configure the network throttling and devices in utils/lighthouseConfig.js

* add flag for headless chrome in utils/generateLighthouseReport.ts

* add new metrics in results list updating components/ShowResults.tsx

## Use

* run the tests
* drag and drop them for generating reports

## Contribute

* use the project added for this repository to report issues, propose features or pick a ticket and get it done https://github.com/catalinnita/client-performance-micro-saas/projects?type=beta

