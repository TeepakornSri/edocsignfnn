import React, { useState, useEffect, useContext } from 'react';
import Joi from 'joi';
import Loading from './Loading';
import { useAuth } from '../hooks/use-auth';
import InputErrorMessage from '../features/InputErrorMessage';
import { Link, useNavigate } from 'react-router-dom';
import UploadButton from './UploadButton';
import { DocContext } from '../contexts/DocContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateSchema = Joi.object({
    docNumber: Joi.string().trim().required(),
    docHeader: Joi.string().trim().required(),
    docInfo: Joi.string().trim().allow('').optional(),
    senderId: Joi.required(),
    contentPDF: Joi.any().required(),
    supportingDocuments: Joi.any().allow('').optional(),
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
    const navigate = useNavigate();
    const { authUser } = useAuth();
    const { saveFile } = useContext(DocContext);
    const [loading, setLoading] = useState(false);
    const [contentPdfPreviewUrl, setContentPdfPreviewUrl] = useState(null);
    const [supportingDocumentsPreviewUrl, setSupportingDocumentsPreviewUrl] = useState(null);
    const [input, setInput] = useState({
        senderId: '',
        docHeader: '',
        docInfo: '',
        contentPDF: '',
        supportingDocuments: '',
    });
    const [error, setError] = useState({});
    const senderId = authUser?.id;

    useEffect(() => {
        return () => {
            if (contentPdfPreviewUrl) {
                URL.revokeObjectURL(contentPdfPreviewUrl);
            }
            if (supportingDocumentsPreviewUrl) {
                URL.revokeObjectURL(supportingDocumentsPreviewUrl);
            }
        };
    }, [contentPdfPreviewUrl, supportingDocumentsPreviewUrl]);

    const handleChangeInput = e => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const handleFileChange = e => {
        const { name, files } = e.target;
        if (files[0] && files[0].type === 'application/pdf') {
            const url = URL.createObjectURL(files[0]);
            setInput({ ...input, [name]: files[0] });
            saveFile(name, files[0]);

            if (name === 'contentPDF') {
                setContentPdfPreviewUrl(url);
            } else if (name === 'supportingDocuments') {
                setSupportingDocumentsPreviewUrl(url);
            }
        } else {
            setError(prevError => ({
                ...prevError,
                [name]: 'โปรดเลือกไฟล์ PDF'
            }));
            if (name === 'contentPDF') {
                setContentPdfPreviewUrl(null);
            } else if (name === 'supportingDocuments') {
                setSupportingDocumentsPreviewUrl(null);
            }
        }
    };

    const handleSubmitCreateContent = e => {
        e.preventDefault();
        const newError = {};

        if (!input.contentPDF) {
            newError.contentPDF = 'โปรดเลือกไฟล์ PDF';
            toast.error('โปรดเลือกไฟล์ PDF');
        }

        if (!input.docHeader) {
            newError.docHeader = 'โปรดกรอกชื่อเอกสาร';
            toast.error('โปรดกรอกชื่อเอกสาร');
        }

        if (Object.keys(newError).length > 0) {
            setError(newError);
            return;
        }

        const docNumber = `Doc-${generateRandomNumber()}`;
        const validationError = validateCreateContent({ ...input, senderId, docNumber });
        if (validationError) {
            setError(validationError);
            Object.values(validationError).forEach(message => toast.error(message));
            return;
        }
        setError({});
        
        const dataToSave = {
            docNumber,
            senderId,
            docHeader: input.docHeader,
            docInfo: input.docInfo,
            contentPDF: input.contentPDF.name,
            supportingDocuments: input.supportingDocuments?.name
        };

        // Log data to console
        console.log('Data to be sent to the next page:', dataToSave);

        // Save metadata to localStorage
        localStorage.setItem('formData', JSON.stringify(dataToSave));
        navigate('/userselect', { state: { dataToSave } }); 
    };

    return (
        <form onSubmit={handleSubmitCreateContent} className="p-6">
            {loading && <Loading />}
            <div className="flex flex-col gap-4 justify-start items-start p-2">
                <div className="flex flex-col md:flex-row justify-evenly bg-white w-full gap-4 p-4  ">
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
                        {error.docHeader && <InputErrorMessage message={'กรอกชื่อเอกสาร'} />}

                        <h1 className="text-xl font-semibold">รายละเอียด</h1>
                        <textarea
                            value={input.docInfo}
                            onChange={handleChangeInput}
                            name="docInfo"
                            className={`block w-full border rounded-md px-3 py-1.5 text-sm h-48 outline-none focus:ring text-start resize-none`}
                        />
                        
                        <h1 className="font-semibold text-lg">แบบฟอร์มขออนุมัติ (PDF Only)</h1>
                        <UploadButton
                            onChange={handleFileChange}
                            name="contentPDF"
                            buttonName="อัพโหลดแบบฟอร์มขออนุมัติ"
                            accept="application/pdf"
                        />
                        {error.contentPDF && <InputErrorMessage message={'โปรดเลือกไฟล์PDF'} />}
                        {contentPdfPreviewUrl && (
                            <embed src={contentPdfPreviewUrl} width="100%" height="500px" className="mt-4" type="application/pdf"></embed>
                        )}
                    </div>
                    <div className='flex flex-col justify-start gap-20  w-full'>
                    <div className="w-full flex flex-col gap-6">
                        <h1 className="font-semibold text-lg">เอกสารประกอบการพิจารณา (PDF Only)</h1>
                        <UploadButton
                            onChange={handleFileChange}
                            name="supportingDocuments"
                            buttonName="อัพโหลดเอกสารประกอบการพิจารณา"
                            accept="application/pdf"
                        />
                        {error.supportingDocuments && <InputErrorMessage message={'โปรดเลือกไฟล์PDF'} />}
                        {supportingDocumentsPreviewUrl && (
                            <embed src={supportingDocumentsPreviewUrl} width="100%" height="500px" className="mt-4" type="application/pdf"></embed>
                        )}
                    </div>
                    <div className="flex flex-row justify-end items-end gap-8 ">
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
