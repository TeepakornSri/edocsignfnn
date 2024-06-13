import React from 'react'
import UserSelectFrom from '../components/UserSelectFrom'

export default function Userselect() {
    return (
        <div className="h-screen w-full  flex flex-col">
            <div className="flex-1 max-w-full flex flex-col  p-4 md:p-8 lg:p-4 m-4 ">
                <div className="flex  w-full flex-1 overflow-auto">
                    <div className="border p-4 flex-1 rounded-lg shadow-lg"><UserSelectFrom/></div>
                </div>
            </div>
        </div>
    )
}
