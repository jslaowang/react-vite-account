import React, { useState, useEffect, useRef } from 'react'
import { Icon, Pull } from 'zarm'
import dayjs from 'dayjs'
import BillItem from '@/components/BillItem'
import { get, REFRESH_STATE, LOAD_STATE } from '@/utils' // Pull 组件需要的一些常量
import s from './style.module.less'
import PopupType from '@/components/PopupType'

const Home = () => {
  const typeRef = useRef()
  const [currentSelect, setCurrentSelect] = useState({}); // 当前筛选类型
  const [currentTime, setCurrentTime] = useState(dayjs().format('YYYY-MM'))
  const [list, setList] = useState([]); // 账单列表
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(0)
  const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal)
  const [loading, setLoading] = useState(LOAD_STATE.normal)

  useEffect(() => {
    getBillList()
  }, [page, currentSelect])

  const getBillList = async () => {
    const { data } = await get(`/api/bill/list?${page}&page_size=5&date=${currentTime}`)
    // 下拉刷新
    if (page === 1) {
      setList(data.list)
    } else {
      setList(list.concat(data.list))
    }
    setTotalPage(data.totalPage)
    setLoading(LOAD_STATE.success)
    setRefreshing(REFRESH_STATE.success)
  }
  const refreshData = () => {
    setRefreshing(REFRESH_STATE.loading)
    if (page === 1) {
      setPage(1)
    } else {
      getBillList()
    }
  }

  const loadData = () => {
    if (page < totalPage) {
      setLoading(LOAD_STATE.loading)
      setPage(page + 1)
    }
  }

  // 添加弹框
  const toggle = () => {
    typeRef.current && typeRef.current.show()
  }

  // 筛选类型
  const select = (item) => {
    setRefreshing(REFRESH_STATE.loading)
    setPage(1)
    setCurrentSelect(item)
  }

  return (
    <div className={s.home} >
      <div className={s.header}>
        <div className={s.dataWrap}>
          <span className={s.expense}>总支出: <b>¥ 200</b></span>
          <span className={s.income}>总收入: <b>¥ 800</b></span>
        </div>
        <div className={s.typeWrap}>
          <div className={s.left}>
            <span className={s.title} onClick={toggle}>
              {currentSelect.name || '全部类型'} <Icon className={s.arrow} type="arrow-bottom" />
            </span>
          </div>
          <div className={s.right}>
            <span className={s.time}>
              2022-06<Icon className={s.arrow} type="arrow-bottom" />
            </span>
          </div>
        </div>
      </div>
      <div className={s.contentWrap}>
        {
          list.length ?
            <Pull
              animationDuration={200}
              stayTime={400}
              refresh={{
                state: refreshing,
                handle: refreshData
              }}
              load={{
                state: loading,
                distance: 200,
                handle: loadData
              }}
            >
              {
                list.map((item, index) =>
                  <BillItem bill={item} key={index} />
                )
              }
            </Pull> : null
        }
      </div>
      <PopupType ref={typeRef} onSelect={select} />
    </div>
  )
}

export default Home