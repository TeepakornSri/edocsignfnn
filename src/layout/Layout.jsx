import { Outlet } from "react-router-dom";
import Header from "./Header";
export default function Layout() {
    return (
        <>
            <div className="flex flex-col h-screen">
                <div className="sticky top-0 z-50">
                    <Header />
                </div>
                <div className="">
                    <Outlet />
                </div>
            </div>
        </>
    )
}