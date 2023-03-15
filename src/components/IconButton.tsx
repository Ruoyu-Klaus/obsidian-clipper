import React, { ButtonHTMLAttributes } from "react"

function IconButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      style={{ width: 36, height: 36 }}
      className="bg-darkGrey text-grey-200 hover:text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg relative hover:bg-blue-800 focus:ring-blue-900 focus:ring-offset-blue-200"
      {...props}>
      {props.children}
    </button>
  )
}

export default IconButton
