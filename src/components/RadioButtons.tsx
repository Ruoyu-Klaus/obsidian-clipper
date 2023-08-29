import React from "react"

import type { VaultFolderOption } from "~types"

export type RadioButtonsProps = {
  options: VaultFolderOption[]
  onOptionChange: (o: string) => void
  onOptionDelete: (o: VaultFolderOption) => void
}

function RadioButtons(props: RadioButtonsProps) {
  const { options, onOptionChange, onOptionDelete } = props
  const handleClickRadio = e => {
    if (e.target.checked && e.target.value) {
      onOptionChange(e.target.value)
    }
  }
  const handleOptionDelete = (v: VaultFolderOption) => {
    onOptionDelete(v)
  }
  return (
    <fieldset onClick={handleClickRadio}>
      <legend className="text-black text-lg mb-2">Default Folders</legend>
      {options.map((option, key) => (
        <div
          className="flex justify-between items-center mb-2 px-2"
          key={`${option}-${key}`}>
          <div className="flex items-center mb-2">
            <input
              id={`${option.folder}-${key}`}
              type="radio"
              name="folders"
              value={option.folder}
              className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 "
              defaultChecked={option.isDefault}
            />
            <label
              htmlFor={`${option.folder}-${key}`}
              className="block ml-2 text-sm font-medium text-gray-900 ">
              {option.displayName}
            </label>
          </div>
          {option.folder !== "/" && (
            <button
              type="button"
              className="cursor-pointer justify-self-end w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 "
              onClick={() => handleOptionDelete(option)}>
              X
            </button>
          )}
        </div>
      ))}
    </fieldset>
  )
}

export default RadioButtons
