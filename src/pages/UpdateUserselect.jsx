import React from 'react'
import UpdateUserSelectForm from '../components/UpdateUserSelectFrom'

export default function UserselectUpdate() {
    return (
        <div className="h-screen w-full  flex flex-col">
            <div className="flex-1 max-w-full flex flex-col  p-4 md:p-8 lg:p-4 m-4 ">
                <div className="flex  w-full flex-1 overflow-auto">
                    <div className="border p-4 flex-1 rounded-lg shadow-lg"><UpdateUserSelectForm/></div>
                </div>
            </div>
        </div>
    )
}
