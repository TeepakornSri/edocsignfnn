import axios from 'axios';
import Joi from 'joi';
import { useRef, useState } from 'react';
import Swal from 'sweetalert2';
import Loading from './Loading';
import { useAuth } from '../hooks/use-auth';
import InputErrorMessage from '../features/InputErrorMessage';
import { Link } from 'react-router-dom';
const CreateSchema = Joi.object({
    docNumber: Joi.string().trim().required(),
    docHeader: Joi.string().trim().required(),
    docInfo: Joi.string().trim().allow('').optional(),
    senderId: Joi.required(),
    contentPDF: Joi.any().custom((value, helpers) => {
        if (!value) return helpers.error('any.required');
        
        if (!value.name.match(/\.(pdf)$/i)) {
            return helpers.error('any.invalid');
        }

        return value;
    }).required(),
    supportingDocuments: Joi.any().allow('').optional().custom((value, helpers) => {
        if (!value) return value;
        
        if (!value.name.match(/\.(pdf)$/i)) {
            return helpers.error('any.invalid');
        }

        return value;
    }),
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
    const inputEl = useRef(null);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        senderId: '',
        docHeader: '',
        docInfo: '',
        contentPDF: '',
        supportingDocuments: '',
    });
    const [error, setError] = useState({});
    const senderId = authUser?.id;

    const handleChangeInput = e => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const handleFileChange = e => {
        const { name, files } = e.target;
        setInput({ ...input, [name]: files[0] });
    };

    const handleSubmitCreateContent = async e => {
        e.preventDefault();
        try {
            const docNumber = `Doc-${generateRandomNumber()}`;
            const formData = new FormData();
            formData.append('docNumber', docNumber);
            formData.append("senderId", senderId);
            formData.append('docHeader', input.docHeader);
            formData.append('docInfo', input.docInfo);
            formData.append('contentPDF', input.contentPDF);
            formData.append('supportingDocuments', input.supportingDocuments);

            console.log("Form Data Before Validation:", formData);

            const validationError = validateCreateContent({ ...input, senderId, docNumber });
            if (validationError) {
                setError(validationError);
                console.log("Validation Errors:", validationError);
                return;
            }
            setError({});
            setLoading(true);
         
            const response = await axios.post('/content', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

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
            console.error("Submission Error:", err);
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Oops Something went wrong...',
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
                        <h1 className="text-xl font-semibold">หัวข้อเอกสาร</h1>
                        <input
                        type="text"
                        placeholder="ชื่อเอกสาร"
                        value={input.docHeader}
                        onChange={handleChangeInput}
                        name="docHeader"
                        className={`block w-full border rounded-md px-3 py-1.5 text-sm outline-none
                        focus:ring h-14
                        ${error.docHeader ? 'border-red-500 focus:ring-red-300' : 'focus:ring-blue-300 focus:border-blue-500 border-gray-300'}`}
/>
{error.docHeader && <InputErrorMessage message={error.docHeader} />}
               
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
                            onChange={handleFileChange}
                            name="contentPDF"
                            className={`block w-full border rounded-md px-3 py-1.5 text-sm outline-none
               focus:ring h-40 pt-4
                ${error.contentPDF ? 'border-red-500 focus:ring-red-300' : 'focus:ring-blue-300 focus:border-blue-500 border-gray-300'}
    `}
/>
{error.contentPDF && <InputErrorMessage message={error.contentPDF} />}
                    </div>
                    <div className="w-full flex flex-col gap-6">
                        <h1 className="font-semibold text-lg">เอกสารประกอบการพิจารณา</h1>
                        <input
                            type="file"
                            placeholder="supportingDocuments"
                            ref={inputEl}
                            onChange={handleFileChange}
                            name="supportingDocuments"
                            className={`block w-full border rounded-md px-3 py-1.5 text-sm outline-none
               focus:ring h-40
               ${error.supportingDocuments ? 'border-red-500 focus:ring-red-300' : 'focus:ring-blue-300  focus:border-blue-500 border-gray-300'}
               `}
                        />
                        <div className="flex flex-row justify-end items-end gap-8">
                            <div>
                            <Link to='/Homepage'>
                            <button className="bg-slate-400 rounded-lg text-white px-3 py-1.5 text-lg font-bold min-w-[10rem] hover:bg-orange-300 hover:scale-125">
                                    ย้อนกลับ
                                </button>
                                </Link>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="bg-orange-500 rounded-lg text-white px-3 py-1.5 text-lg font-bold min-w-[10rem] hover:bg-orange-300 hover:scale-125">
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
