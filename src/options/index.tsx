import React, { useState } from "react"

import "~/style/base.css"

function index() {
  return (
    <div className="h-screen flex flex-col gap-2 justify-center items-center">
      <div className="h-1/2 rounded-lg sm:max-w-md sm:w-full sm:mx-auto sm:overflow-hidden">
        <div className="px-4 py-8 sm:px-10 h-full">
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm leading-5">
              <span className="px-2 text-gray-500 bg-white">
                Obsidian Clipper Options
              </span>
            </div>
          </div>
          <div className="mt-6 h-full">
            <div className="w-full h-4/5 flex flex-col gap-2 justify-between items-center ">
              <div className="w-full">
                <div className=" relative">
                  <label
                    className="text-black text-lg border-b"
                    htmlFor="target-folder">
                    Target Folder
                  </label>
                  <input
                    type="text"
                    id="target-folder"
                    className="mt-2 rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="Target Folder"
                    defaultValue={"resources"}
                  />
                </div>
              </div>

              <div>
                <span className="block w-full rounded-md shadow-sm">
                  <button
                    type="button"
                    className="py-2 px-4  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                    Save Changes
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="sm:max-w-md sm:w-full sm:mx-auto px-4 py-6 border-t-2 border-gray-200 sm:px-10">
        <p className="text-xs leading-5 text-gray-500">
          © 2023 Ruoyu. All rights reserved. v1.0.0
        </p>
      </div>
    </div>
  )
}

export default index
