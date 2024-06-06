import LoginForm from "../features/login/LoginForm";
import RegisterContainer from "../features/register/ResgisterContainer";

export default function LoginPage() {
    return (
        <div className="flex justify-center items-center gap-4 mt-8 min-h-screen w-full">
            <div className="flex-col h-[600px] min-w-[600px] px-6 pt-8 bg-white rounded-lg shadow-[0_0_15px_rgb(0_0_0_/0.2)] mb-6 border">
                <h1 className="text-center font-bold text-4xl mb-9">Login</h1>
                <LoginForm />
                <hr className="border-gray-500 my-4 mt-10" />
                <RegisterContainer />
            </div>

        </div>
    )
}