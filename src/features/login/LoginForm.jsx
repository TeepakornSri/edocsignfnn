
import { useAuth } from "../../hooks/use-auth"
import { toast } from 'react-toastify'
import { useState } from "react";
import LoginInput from "./LoginInput";
import LoginButton from "./LoginButton";
import Swal from 'sweetalert2'



export default function LoginForm() {
    const [input, setInput] = useState({
        email: '',
        password: ''
    })


    const handleLogout = () => {
        logout();

        if (authUser === null) {
            alert('Please Login');
        } else {
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Log out",
                showConfirmButton: false,
                timer: 1500
            });
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
    };


    const { login } = useAuth()
    const handleSubmitForm = e => {
        e.preventDefault()
        login(input).catch(err => {
            toast.error(err.response.data.message)
        })

    }


    return (
        <form onSubmit={handleSubmitForm}>
            <div className="grid gap-10 items-center justify-center">
                <LoginInput placeholder="Email address" value={input.email} onChange={e => setInput({ ...input, email: e.target.value })} />
                <LoginInput type="password" placeholder="Password" value={input.password} onChange={e => setInput({ ...input, password: e.target.value })} />
                <LoginButton />
            </div>
        </form>)

}