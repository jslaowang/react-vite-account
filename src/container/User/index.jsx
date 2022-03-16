import React from 'react'
import cx from 'classnames'
import s from './style.module.less'

export default function User() {
  return <div className={s.user}>
    <img className={s.avatar} src="/src/assets/img/avatar.png" />
    <div className={s.name}>昵称: 喵喵喵</div>
    <div className={s.box}>
      <div className={s.track} >
        <div className={cx({ [s.child]: true, [s.child1]: true })} >喵了个咪的~</div>
      </div>
      <div className={s.track}>
        <div className={cx({ [s.child]: true, [s.child2]: true })} >小鱼干~</div>
      </div>
      <div className={s.track}>
        <div className={cx({ [s.child]: true, [s.child3]: true })} >干饭了~</div>
      </div>
    </div>
  </div>
}