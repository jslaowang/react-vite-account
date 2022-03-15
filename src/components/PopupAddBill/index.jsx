import React, { useState, useEffect, useRef, forwardRef } from "react";
import PropTypes from 'prop-types'
import { Popup, Icon, Keyboard, Input, Toast } from "zarm";
import cx from 'classnames'
import dayjs from "dayjs";
import PopupDate from '@/components/PopupDate'
import CustomIcon from '@/components/CustomIcon'
import { get, post, typeMap } from '@/utils'
import s from './style.module.less'

const PopupAddBill = forwardRef((props, ref) => {
  const dateRef = useRef()
  const [date, setDate] = useState(new Date())
  const [show, setShow] = useState(false)
  const [amount, setAmount] = useState('')
  const [payType, setPayType] = useState('expense') // 支出或收入
  const [currentType, setCurrentType] = useState({})
  const [expense, setExpense] = useState([])
  const [income, setIncome] = useState([])
  const [remark, setRemark] = useState('')
  const [showRemark, setShowRemark] = useState(false)

  useEffect(async () => {
    const { data: { list } } = await get('/api/type/list')
    const _expense = list.filter(item => item.type === '1') // 支出
    const _income = list.filter(item => item.type === '2') // 收入
    setExpense(_expense)
    setIncome(_income)
    setCurrentType(_expense[0]) // 设置默认类型
  }, [])

  if (ref) {
    ref.current = {
      show: () => {
        setShow(true)
      },
      close: () => {
        setShow(false)
      }
    }
  }

  // 选择支付类型
  const changeType = (type) => {
    setPayType(type)
  }

  const selectDate = (date) => {
    setDate(date)
  }

  const handleMoney = (value) => {
    value = String(value)
    if (value === 'delete') {
      let _amount = amount.slice(0, amount.length - 1)
      setAmount(_amount)
      return
    }
    if (value === '.' && amount.includes('.')) return
    if (value !== '.' && amount.includes('.') && amount && amount.split('.')[1].length >= 2) return
    setAmount(amount + value)
    if (value === 'ok') {
      addBill()
      return
    }
  }

  const addBill = async () => {
    if (!amount) {
      Toast.show('请输入金额')
      return
    }
    const params = {
      amount: Number(amount).toFixed(2), // 账单金额小数点后保留两位
      type_id: currentType.id, // 账单种类id
      type_name: currentType.name, // 账单种类名称
      date: dayjs(date).unix() * 1000, // 日期传时间戳
      pay_type: payType == 'expense' ? 1 : 2, // 账单类型传 1 或 2
      remark: remark || '' // 备注
    }
    const result = await post('/api/bill/add', params)

    // 重置数据
    setAmount('')
    setPayType('expense')
    setCurrentType(expense[0])
    setDate(new Date())
    setRemark('')
    Toast.show('添加成功')
    setShow(false)
    if (props.onReload) {
      props.onReload()
    }
  }

  return (
    <Popup
      visible={show}
      direction="bottom"
      onMaskClick={() => setShow(false)}
      destroy={false}
      mountContainer={() => document.body}
    >
      <div className={s.addWrap}>
        <header className={s.header}>
          <span className={s.close} onClick={() => { setShow(false) }} ><Icon type="wrong" /></span>
        </header>
        <div className={s.filter}>
          <div className={s.type}>
            <span onClick={() => changeType('expense')} className={cx({ [s.expense]: true, [s.active]: payType === 'expense' })}>支出</span>
            <span onClick={() => changeType('income')} className={cx({ [s.income]: true, [s.active]: payType === 'income' })}>收入</span>
          </div>
          <div className={s.time} onClick={() => dateRef.current && dateRef.current.show()}>
            {dayjs(date).format('MM-DD')}
            <Icon className={s.arrow} type="arrow-bottom" />
          </div>
        </div>
        <div className={s.money}>
          <span className={s.suffix}>¥</span>
          <span className={cx(s.amount, s.animation)}>{amount}</span>
        </div>
        <div className={s.typeWrap}>
          <div className={s.typeBody}>
            {
              (payType === 'expense' ? expense : income).map(item =>
                <div onClick={() => setCurrentType(item)} key={item.id} className={s.typeItem}>
                  <span className={cx({ [s.iconfontWrap]: true, [s.expense]: payType == 'expense', [s.income]: payType == 'income', [s.active]: currentType.id == item.id })}>
                    <CustomIcon className={s.iconfont} type={typeMap[item.id].icon} />
                  </span>
                  <span>{item.name}</span>
                </div>)
            }
          </div>
        </div>
        <div className={s.remark}>
          {
            showRemark ?
              <Input
                autoHeight
                showLength
                maxLength={50}
                type="text"
                rows={3}
                value={remark}
                placeholder="请输入备注信息"
                onChange={(val) => setRemark(val)}
                onBlur={() => setShowRemark(false)}
              /> : <span onClick={() => setShowRemark(true)}>{remark || '添加备注'} </span>
          }

        </div>
        <Keyboard type="price" onKeyClick={(value) => handleMoney(value)} />
        <PopupDate ref={dateRef} onSelect={selectDate} />
      </div>
    </Popup>
  )
})

export default PopupAddBill