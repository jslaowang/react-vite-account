import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import { SwipeAction, Button, Cell, Modal, Toast } from 'zarm'
import { useHistory } from "react-router-dom";
import CustomIcon from '@/components/CustomIcon'
import { post, typeMap } from '@/utils'
import s from './style.module.less'

const BillItem = (prop) => {
  const { bill } = prop
  const [income, setIncom] = useState(0) // 收入
  const [expense, setExpense] = useState(0) // 支出
  const history = useHistory() // 路由

  useEffect(() => {
    const _income = bill.bills.filter(item => item.pay_type === 2).reduce((curr, item) => {
      curr += Number(item.amount)
      return curr
    }, 0)
    setIncom(_income)
    const _expense = bill.bills.filter(item => item.pay_type === 1).reduce((curr, item) => {
      curr += Number(item.amount)
      return curr
    }, 0)
    setExpense(_expense)
  }, [bill.bills])

  const goToDetail = (item) => {
    history.push(`/detail?id=${item.id}`)
  }
  const onDelete = (item) => {
    Modal.confirm({
      content: '确认删除此账单？',
      okText: '删除',
      onOk: async () => {
        const { data } = await post('/api/bill/delete', { id: item.id })
        Toast.show('删除成功')
        prop.onReload()
      },
    });
  }
  return (
    <div className={s.item}>
      <div className={s.headerDate}>
        <div className={s.date}>{bill.date}</div>
        <div className={s.money}>
          <span>
            <img src="//s.yezgea02.com/1615953405599/zhi%402x.png" alt='支' />
            <span>¥{expense.toFixed(2)}</span>
          </span>
          <span>
            <img src="//s.yezgea02.com/1615953405599/shou%402x.png" alt="收" />
            <span>¥{income.toFixed(2)}</span>
          </span>
        </div>
      </div>
      {
        bill && bill.bills.map(item =>
          <SwipeAction
            key={item.id}
            right={[
              <Button className={s.delete} size="lg" shape="rect" theme="danger" onClick={() => onDelete(item)}>
                删除
              </Button>,
            ]}
          >
            <Cell
              className={s.bill}
              onClick={() => goToDetail(item)}
              title={
                <>
                  <CustomIcon className={s.itemIcon} type={item.type_id ? typeMap[item.type_id].icon : 1} />
                  <span>{item.type_name}</span>
                </>
              }
              description={<span style={{ color: item.pay_type === 2 ? 'red' : '#39be77' }}>{`${item.pay_type === 1 ? '-' : '+'}${item.amount}`}</span>}
              help={<div>{dayjs(Number(item.date)).format('HH:mm')} {item.remark ? `| ${item.remark}` : ''}</div>}
            >
            </Cell>
          </SwipeAction>
        )
      }
    </div>
  )
}

export default BillItem