import Updateform from "../components/Updatefrom"

export default function UpdatePage() {
    return (
        <div className="h-screen w-full  flex flex-col">
            <div className="flex-1 max-w-full flex flex-col  p-4 md:p-8 lg:p-16 m-4 ">
                <div className="font-bold text-2xl md:text-4xl lg:text-6xl m-4">
                    <h1>อัปโหลดเอกสาร</h1>
                </div>
                <div className="flex  w-full flex-1 overflow-auto">
                    <div className="border p-4 flex-1 rounded-lg shadow-lg"><Updateform /></div>
                </div>
            </div>
        </div>
    )
}
