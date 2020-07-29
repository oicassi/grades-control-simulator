import React from 'react'
import css from './action.module.css';

export default function Action({type, id, onActionClick}) {
  const handleIconClick = () => {
    onActionClick(id, type)
  }
  return (
    <span 
      className={`material-icons ${css.singleIcon}`}
      style={{cursor:'pointer'}}
      onClick={handleIconClick}>
        {type}
    </span>
  )
}
