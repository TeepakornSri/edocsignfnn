import axios from 'axios';
import Joi from 'joi';
import { useRef, useState } from 'react';
import Swal from 'sweetalert2';
import Loading from './Loading';
import { useAuth } from '../hooks/use-auth';


const CreateSchema = Joi.object({
    docNumber: Joi.string().trim().required(),
    topic: Joi.string().trim().required(),
    docHeader: Joi.string().trim().required(),
    docInfo: Joi.string().trim().required(),
    senderId: Joi.required(),
    contentPDF: Joi.required(),
    supportingDocuments: Joi.required(),
});

const validateCreateContent = input => {
    const { error } = CreateSchema.validate(input, { abortEarly: false });
    if (error) {
        const result = error.details.reduce((acc, el) => {
            const { message, path } = el;
            acc[path[0]] = message;
            return acc;
        }, {});
        return result;
    }
};

const generateRandomNumber = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export default function Uploadform() {
    const { authUser } = useAuth();
    const [file, setFile] = useState(null);
    const inputEl = useRef(null);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        senderId: '',
        docHeader: '',
        docInfo: '',
        contentPDF: '',
        supportingDocuments: '',
        topic: '',
    });
    const [error, setError] = useState({});
    const senderId = authUser?.id;

    const handleChangeInput = e => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const handleSubmitCreateContent = async e => {
        try {
            e.preventDefault();
            const docNumber = `Doc-${generateRandomNumber()}`;
            const formData = new FormData();
            formData.append('docNumber', docNumber);
            formData.append("senderId", senderId);
            formData.append('docHeader', input.docHeader);
            formData.append('docInfo', input.docInfo);
            formData.append('contentPDF', input.contentPDF);
            formData.append('supportingDocuments', input.supportingDocuments);
            formData.append('topic', input.topic);

            const validationError = validateCreateContent(input);
            if (validationError) {
                setError(validationError);
                return;
            }

            setError({});
            setLoading(true);

            const response = await axios.post('/content', formData);

            if (response.status === 200) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Success',
                    showConfirmButton: false,
                    timer: 1500,
                });
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        } catch (err) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Oops Something wrong...',
                showConfirmButton: false,
                timer: 1500,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmitCreateContent} className="p-6">
            {loading && <Loading />}
            <div className="flex flex-col gap-4 justify-start items-start p-2">
                <div className="flex flex-col md:flex-row justify-evenly bg-white w-full gap-4 p-4 ">
                    <div className="w-full flex flex-col gap-6">
                        <h1 className="text-xl font-semibold">เอกสารเรื่อง</h1>
                        <input
                            type="text"
                            placeholder="ชื่อเอกสาร"
                            value={input.topic}
                            onChange={handleChangeInput}
                            name="topic"
                            className={`block w-full border rounded-md px-3 py-1.5 text-sm outline-none
               focus:ring h-14
               ${error.topic ? 'border-red-500 focus:ring-red-300' : 'focus:ring-blue-300  focus:border-blue-500 border-gray-300'}
               `}
                        />
                        <h1 className="text-xl font-semibold">รายละเอียด</h1>
                        <input
                            type="text"
                            value={input.docInfo}
                            onChange={handleChangeInput}
                            name="docInfo"
                            className={`block w-full border rounded-md px-3 py-1.5 text-sm h-48 outline-none
               focus:ring
               `}
                        />
                        <h1 className="font-semibold text-lg">แบบฟอร์มขออนุมัติ (PDF Only)</h1>
                        <input
                            type="file"
                            placeholder="contentPDF"
                            ref={inputEl}
                            onChange={e => {
                                if (e.target.files[0]) {
                                    setFile(e.target.files[0]);
                                    setInput({ ...input, contentPDF: e.target.files[0] });
                                }
                            }}
                            name="contentPDF"
                            className={`block w-full border rounded-md px-3 py-1.5 text-sm outline-none
               focus:ring h-40 pt-4
               ${error.contentPDF ? 'border-red-500 focus:ring-red-300' : 'focus:ring-blue-300  focus:border-blue-500 border-gray-300'}
               `}
                        />
                    </div>
                    <div className="w-full flex flex-col gap-6">
                        <h1 className="font-semibold text-lg">เอกสารประกอบการพิจารณา</h1>
                        <input
                            type="file"
                            placeholder="supportingDocuments"
                            ref={inputEl}
                            onChange={e => {
                                if (e.target.files[0]) {
                                    setFile(e.target.files[0]);
                                    setInput({ ...input, supportingDocuments: e.target.files[0] });
                                }
                            }}
                            name="supportingDocuments"
                            className={`block w-full border rounded-md px-3 py-1.5 text-sm outline-none
               focus:ring h-40
               ${error.supportingDocuments ? 'border-red-500 focus:ring-red-300' : 'focus:ring-blue-300  focus:border-blue-500 border-gray-300'}
               `}
                        />
                        <div className="flex flex-row justify-end items-end gap-8">
                            <div>
                                <button className="bg-orange-500 rounded-lg text-white px-3 py-1.5 text-lg font-bold min-w-[10rem] hover:bg-orange-300">
                                    ย้อนกลับ
                                </button>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="bg-orange-500 rounded-lg text-white px-3 py-1.5 text-lg font-bold min-w-[10rem] hover:bg-orange-300">
                                    ถัดไป
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
