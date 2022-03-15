import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import qs from 'query-string'
import dayjs from 'dayjs'
import cx from 'classnames'
import { get, typeMap } from '@/utils'
import Header from '@/components/Header'
import CustomIcon from '@/components/CustomIcon'
import s from './style.module.less'

const Detail = () => {
  const location = useLocation()
  const { id } = qs.parse(location.search)
  const [detail, setDetail] = useState({})

  useEffect(() => {
    getDetail()
  }, [])

  const getDetail = async () => {
    const { data } = await get(`/api/bill/detail?id=${id}`)
    setDetail(data)
  }

  return <div className={s.detail}>
    <Header title="账单详情" />
    <div className={s.card}>
      <div className={s.type}>
        <span className={cx({ [s.expense]: detail.pay_type == 1, [s.income]: detail.pay_type == 2 })}>
          <CustomIcon className={s.iconfont} type={detail.type_id ? typeMap[detail.type_id].icon : 1} />
        </span>
        <span>{detail.type_name || ''}</span>
      </div>
      {
        detail.pay_type == 1
          ? <div className={cx(s.amount, s.expense)}>-{detail.amount}</div>
          : <div className={cx(s.amount, s.incom)}>+{detail.amount}</div>
      }
      <div className={s.info}>
        <div className={s.time}>
          <span>记录时间</span>
          <span>{dayjs(Number(detail.date)).format('YYYY-MM-DD HH:mm')}</span>
        </div>
        <div className={s.remark}>
          <span>备注</span>
          <span>{detail.remark || '暂无备注'}</span>
        </div>
      </div>
    </div>
  </div>
}

export default Detail