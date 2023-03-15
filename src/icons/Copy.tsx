import React, { SVGAttributes } from "react"

export default function Copy(props) {
  return (
    <svg
      width="18"
      height="20"
      style={{ margin: "0 auto" }}
      viewBox="0 0 18 20"
      fill="none"
      {...props}
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5 5V13C5 13.5304 5.21071 14.0391 5.58579 14.4142C5.96086 14.7893 6.46957 15 7 15H13M5 5V3C5 2.46957 5.21071 1.96086 5.58579 1.58579C5.96086 1.21071 6.46957 1 7 1H11.586C11.8512 1.00006 12.1055 1.10545 12.293 1.293L16.707 5.707C16.8946 5.89449 16.9999 6.1488 17 6.414V13C17 13.5304 16.7893 14.0391 16.4142 14.4142C16.0391 14.7893 15.5304 15 15 15H13M5 5H3C2.46957 5 1.96086 5.21071 1.58579 5.58579C1.21071 5.96086 1 6.46957 1 7V17C1 17.5304 1.21071 18.0391 1.58579 18.4142C1.96086 18.7893 2.46957 19 3 19H11C11.5304 19 12.0391 18.7893 12.4142 18.4142C12.7893 18.0391 13 17.5304 13 17V15"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}