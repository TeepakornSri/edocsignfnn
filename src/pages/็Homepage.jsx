import HaederHomePage from "../components/HeaderHomepage"
import DocTable from "../components/aggrid";
import ShowdocPdf from "../components/ShowDocPdf";
import { useEffect } from "react";
import { useDoc } from '../hooks/use-doc';


export default function HomePage() {

    return (
        <div className="h-screen w-full  flex flex-col">
           <div className="w-full h-full p-4">
            <div className="w-full h-full flex flex-row gap-2 bg-slate-100 rounded-md shadow-2xl">
            <div className="w-full h-full overflow-y-scroll p-2">
            <DocTable/>
            </div>
            </div>
           </div>
        </div>
    )
}
