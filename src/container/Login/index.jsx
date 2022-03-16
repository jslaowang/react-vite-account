import React, { useState } from 'react'
import { Cell, Input, Button, Checkbox, Toast } from 'zarm'
import { useHistory } from "react-router-dom";
import CustomIcon from '@/components/CustomIcon'
import s from './style.module.less'
import axios from '@/utils/axios'
import cx from 'classnames'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [type, setType] = useState('login')
  const history = useHistory() // 路由

  const onSubmit = async () => {
    if (!username) {
      Toast.show('请输入账号')
      return
    }
    if (!password) {
      Toast.show('请输入密码')
      return
    }
    try {
      const url = type === 'login' ? '/api/user/login' : '/api/user/register'
      const tip = type === 'login' ? '登录成功' : '注册成功'
      const { data } = await axios.post(url, { username, password });
      Toast.show(tip)

      if (type === 'login') {
        // 将 token 写入 localStorage
        localStorage.setItem('token', data.token);
        history.push(`/`)
      } else {
        setType('login')
      }
    } catch (error) {
      Toast.show('系统错误')
    }
  }


  return (
    <div className={s.auth}>
      <div className={s.head}></div>
      <div className={s.tab}>
        <span className={cx({ [s.avtive]: type == 'login' })} onClick={() => { setType('login') }}>登录</span>
        <span className={cx({ [s.avtive]: type == 'register' })} onClick={() => { setType('register') }}>注册</span>
      </div>
      <div className={s.form}>
        <Cell icon={<CustomIcon type="zhanghao" />}>
          <Input type='text' clearable placeholder='请输入账号' onChange={(value) => setUsername(value)} />
        </Cell>
      </div>
      <div className={s.form}>
        <Cell icon={<CustomIcon type="mima" />}>
          <Input type='password' clearable placeholder='请输入密码' onChange={(value) => setPassword(value)} />
        </Cell>
      </div>
      <div className={s.operation}>
        <Button block theme='primary' onClick={onSubmit}>{type === 'login' ? '登录' : '注册'}</Button>
      </div>
    </div>
  )
}

export default Login