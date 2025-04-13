import React from 'react'

function layout({children}) {
  return (
    <>
    {children || <Outlet />}
    </>
  )
}

export default layout