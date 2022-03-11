import React, { useState } from 'react'
import routes from '@/router'
import {
  BrowserRouter as Router,
  Switch,Route
} from "react-router-dom"

import { ConfigProvider } from 'zarm'
import zhCN from 'zarm/lib/config-provider/locale/zh_CN'
// import 'zarm/dist/zarm.css'

function App() {
  return <Router>
    <ConfigProvider primaryColor='#007fff' locale={zhCN}>
      <Switch>
        {
          routes.map(route =>
            <Route exact key={route.path} path={route.path}>
              <route.component />
            </Route>
          )
        }
      </Switch>
    </ConfigProvider>
  </ Router>
}

export default App
