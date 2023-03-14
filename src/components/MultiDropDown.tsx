import React, { useState } from "react"

function MultiDropDown() {
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedValue, setSelectedValue] = useState("/")
  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown((pre) => !pre)}
        className="w-40 text-white focus:outline-none font-medium rounded-lg text-sm px-2.5 py-2.5 text-center inline-flex items-center bg-darkGrey hover:bg-blue-800 focus:ring-blue-900 relative"
        type="button">
        {selectedValue || "Select a folder"}
        <svg
          className="w-4 h-4 absolute right-2.5"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      <div
        id="dropdown"
        className={`z-10 ${
          showDropdown || "hidden"
        } absolute z-10 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}>
        <ul
          className="py-2 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="multiLevelDropdownButton">
          <li>
            <a
              href="#"
              onClick={() => {
                setShowDropdown(false)
                setSelectedValue("/")
              }}
              className="block px-4 py-2 hover:bg-blue-800 hover:text-white">
              /
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={() => {
                setShowDropdown(false)
                setSelectedValue("/resources")
              }}
              className="block px-4 py-2 hover:bg-blue-800 hover:text-white">
              /resources
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default MultiDropDown
