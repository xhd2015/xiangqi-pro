
import * as React from 'react';
import { createRoot } from "react-dom/client";

// import { installDefaultErrHandler } from './component/system';
import routes from "./routes";

// dynamic import, dynamic code spliting
// import('antd/dist/antd.css');

import 'antd/dist/antd.css'

// use bootstrap
// import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";

// install default handler
// installDefaultErrHandler()

const rootElement = document.getElementById('root');
const root = createRoot(rootElement)

// root.render(
//     <div>Hello</div>
// )

root.render(React.createElement(routes));

