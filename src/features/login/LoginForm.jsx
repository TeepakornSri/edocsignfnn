import { useAuth } from "../../hooks/use-auth";
import { toast } from 'react-toastify';
import { useState } from "react";
import LoginInput from "./LoginInput";
import LoginButton from "./LoginButton";
import InputErrorMessage from '../../features/InputErrorMessage';

export default function LoginForm() {
    const [input, setInput] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState({});

    const { login } = useAuth();

    const validateInput = () => {
        const newError = {};
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!input.email) {
            newError.email = "กรุณาใส่ Email";
        } else if (!emailPattern.test(input.email)) {
            newError.email = "รูปแบบ Email ไม่ถูกต้อง";
        }
        if (!input.password) {
            newError.password = "ต้องการรหัสผ่าน";
        }
        setError(newError);
        return Object.keys(newError).length === 0;
    };

    const handleSubmitForm = e => {
        e.preventDefault();
        if (validateInput()) {
            login(input).catch(err => {
                toast.error(err.response.data.message);
            });
        } else {
            toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
        }
    };

    return (
        <form onSubmit={handleSubmitForm}>
            <div className="grid gap-10 items-center justify-center">
                <div className="w-full">
                    <LoginInput
                        type="email"
                        placeholder="Email address"
                        value={input.email}
                        onChange={e => setInput({ ...input, email: e.target.value })}
                        hasError={error.email}
                    />
                    {error.email && <InputErrorMessage message={error.email} />}
                </div>
                <div className="w-full">
                    <LoginInput
                        type="password"
                        placeholder="Password"
                        value={input.password}
                        onChange={e => setInput({ ...input, password: e.target.value })}
                        hasError={error.password}
                    />
                    {error.password && <InputErrorMessage message={error.password} />}
                </div>
                <LoginButton />
            </div>
        </form>
    );
}
