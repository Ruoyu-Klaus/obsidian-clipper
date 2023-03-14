import React, { ButtonHTMLAttributes } from "react"

function IconButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      style={{ width: 36, height: 36 }}
      className="bg-darkGrey hover:bg-gray-600 focus:ring-bg-gray-600 focus:ring-offset-grey-200 text-grey-200 w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg relative"
      {...props}>
      {props.children}
    </button>
  )
}

export default IconButton
