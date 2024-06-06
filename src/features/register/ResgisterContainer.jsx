import { useState } from "react";
import Modal from "../../components/Modal";
import RegisterForm from "./RegisterForm";

export default function RegisterContainer() {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div className="flex justify-center">
            <button className="bg-slate-400 mt-10 text-white rounded-md px-2 py-2 font-bold w-[200px] hover:bg-slate-600" onClick={() => setIsOpen(true)}>Create new account</button>
            <Modal title="Sign Up" open={isOpen} onClose={() => setIsOpen(false)}>
                <RegisterForm />
            </Modal>
        </div>
    )
}