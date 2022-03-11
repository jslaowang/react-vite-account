import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { TabBar } from 'zarm'
import s from './style.module.less'
import CustomerIcon from '@/components/CustomerIcon'

const Navbar = ({ showNav }) => {
  const [activeKey, setActiveKey] = useState('/')
  const history = useHistory()

  const changeTab = (path) => {
    setActiveKey(path)
    history.push(path)
  }

  return (
    <TabBar visible={showNav} className={s.tab} activeKey={activeKey} onChange={changeTab}>
      <TabBar.Item itemKey="/" title="账单" icon={<CustomerIcon type="zhangdan" />} />
      <TabBar.Item itemKey="/data" title="统计" icon={<CustomerIcon type="tongji" />} />
      <TabBar.Item itemKey="/user" title="我的" icon={<CustomerIcon type="wode" />} />
    </TabBar>
  )
}

Navbar.propTypes = {
  showNav: PropTypes.bool
}

export default Navbar