
# SGLN

BackOffice application of National Lottery Management Company.

## Features

- Account
- Requestes
- Send Notification and alerts
- Excellence Program
- Retailer account modification
- Reporting
- Application setting

  
## Tech Stack

**Client:** React, Redux, Axios, Reactstarp
  ### Coding Guidelines

#### Imports

Order in the following levels, alphabetized by the `source name`, and spaced out the levels with a new line.

Frontend

<ol>
<li>External Packages (but put react related packages first)</li>

```
import { useEffect, useRef, useState } from 'react';

```

<li>Internal packages</li>

```
No example because we don't have any internal packages yet
```

<li>Local Files (ordered/alphabetized by current directory to farthest)</li>

```
import { Journal } from './return-flow';
import { DashboardSvg } from '../components';
import { useNotifications } from '../hooks';
import { setAppJson } from '../redux/app/app-actions';
```
<li>Sending Props</li>

```
<Foo
  userName="hello"
  phoneNumber={12345678}
/>
```
</ol>

## File strtucture and Guidelines 


Please follow [React] (https://reactjs.org/docs/faq-structure.html) for file and directory structure.

Please follow [Airbnb] (https://airbnb.io/javascript/react/) guidelines for React js.

## Other Guidelines

* [Use PropTypes](https://reactjs.org/docs/typechecking-with-proptypes.html)
* [Use react fragments to avoid extra HTML wrappers](https://reactjs.org/docs/fragments.html)
* [Avoid using index as key for map](https://www.youtube.com/watch?v=xlPxnc5uUPQ)
* [Create Error Boundaries for the Components](https://reactjs.org/docs/error-boundaries.htm)
* [Use route based code splitting](https://reactjs.org/blog/2018/10/23/react-v-16-6.html)
* [Use React Memo for components](https://reactjs.org/blog/2018/10/23/react-v-16-6.html)

## Run Locally

Clone the project

```bash
  https://algoconsultinggroup.visualstudio.com/SGLN.Lottery
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

  
## Deployment

To deploy this project run

```bash
  npm run build
```
