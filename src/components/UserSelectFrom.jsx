import React, { useEffect, useState, useContext, useRef } from 'react';
import { DocContext } from '../contexts/DocContext';
import ButtonSmall from './ButtonSmall';
import { toast } from 'react-toastify';
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useAuth } from '../hooks/use-auth';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from './Loading';
import Swal from 'sweetalert2';

const topics = {
    APPROVE: 'APPROVE',
    REVIEW: 'REVIEW'
};

export default function UserSelectForm() {
    const { authUser, setInitialLoading } = useAuth();
    const { getFile } = useContext(DocContext);
    const [formData, setFormData] = useState(null);
    const [contentPdfUrl, setContentPdfUrl] = useState(null);
    const [supportingDocumentsUrl, setSupportingDocumentsUrl] = useState(null);
    const [showContentPdf, setShowContentPdf] = useState(true);
    const [allUsers, setAllUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState(topics.APPROVE);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('formData'));
        if (authUser && data) {
            setFormData(data);
            axios.get('/auth/alluser')
                .then(res => {
                    setAllUsers(res.data.users);
                })
                .finally(() => {
                    setInitialLoading(false);
                });
        } else {
            setInitialLoading(false);
        }
    }, [authUser, setInitialLoading]);

    useEffect(() => {
        if (formData) {
            const contentPDF = getFile('contentPDF');
            const supportingDocuments = getFile('supportingDocuments');

            if (contentPDF) {
                const contentPdfUrl = URL.createObjectURL(contentPDF);
                setContentPdfUrl(contentPdfUrl);
            }

            if (supportingDocuments) {
                const supportingDocumentsUrl = URL.createObjectURL(supportingDocuments);
                setSupportingDocumentsUrl(supportingDocumentsUrl);
            }

            // Cleanup URLs on unmount
            return () => {
                if (contentPdfUrl) {
                    URL.revokeObjectURL(contentPdfUrl);
                }
                if (supportingDocumentsUrl) {
                    URL.revokeObjectURL(supportingDocumentsUrl);
                }
            };
        }
    }, [formData, getFile]);

    useEffect(() => {
        if (search) {
            const results = allUsers.filter(user =>
                `${user.firstName} ${user.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredUsers(results);
        } else {
            setFilteredUsers([]);
        }
    }, [search, allUsers]);

    const toggleShowContent = () => {
        if (!supportingDocumentsUrl) {
            toast.error("ไม่มีเอกสารประกอบการพิจารณา");
            return;
        }
        setShowContentPdf(!showContentPdf);
    };

    const handleInputChange = (e) => {
        setSearch(e.target.value);
        setShowSuggestions(true);
    };

    const handleSuggestionClick = (suggestion) => {
        if (!selectedUsers.some(user => user.id === suggestion.id)) {
            const step = selectedUsers.length + 1;
            setSelectedUsers([...selectedUsers, { ...suggestion, step }]);
        }
        setSearch('');
        setShowSuggestions(false);
    };

    const handleClickOutside = (event) => {
        if (inputRef.current && !inputRef.current.contains(event.target)) {
            setShowSuggestions(false);
        }
    };

    const handleTopicChange = (e) => {
        setSelectedTopic(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedUsers.length === 0) {
            toast.error("โปรดเลือกผู้รับเอกสารอย่างน้อยหนึ่งคน");
            return;
        }
    
        const confirmSubmit = await Swal.fire({
            title: 'ยืนยันการส่งเอกสาร',
            text: "คุณต้องการส่งเอกสารนี้หรือไม่?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ใช่',
            cancelButtonText: 'ยกเลิก'
        });
    
        if (confirmSubmit.isConfirmed) {
            const dataToSave = {
                ...formData,
                topic: selectedTopic,
                recipients: selectedUsers.map(user => ({
                    recipientId: user.id,
                    step: user.step 
                }))
            };
    
            const formDataToSend = new FormData();
            formDataToSend.append('docNumber', dataToSave.docNumber);
            formDataToSend.append('senderId', dataToSave.senderId);
            formDataToSend.append('docHeader', dataToSave.docHeader);
            formDataToSend.append('docInfo', dataToSave.docInfo);
            formDataToSend.append('topic', dataToSave.topic);
            formDataToSend.append('contentPDF', getFile('contentPDF'));
            if (dataToSave.supportingDocuments) {
                formDataToSend.append('supportingDocuments', getFile('supportingDocuments'));
            }
            dataToSave.recipients.forEach((recipient, index) => {
                formDataToSend.append(`recipients[${index}][recipientId]`, recipient.recipientId);
                formDataToSend.append(`recipients[${index}][step]`, recipient.step); // เพิ่ม step ตรงนี้
            });
    
            setLoading(true);
            try {
                const response = await axios.post('/content', formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
    
                if (response.status === 200) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "เอกสารถูกบันทึกเรียบร้อยแล้ว",
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        // Clear local storage and URLs
                        localStorage.removeItem('formData');
                        if (contentPdfUrl) URL.revokeObjectURL(contentPdfUrl);
                        if (supportingDocumentsUrl) URL.revokeObjectURL(supportingDocumentsUrl);
    
                        setContentPdfUrl(null);
                        setSupportingDocumentsUrl(null);
     
                        navigate('/homepage');
                        window.location.reload();
                    });
                }
            } catch (error) {
                toast.error("เกิดข้อผิดพลาดในการบันทึกเอกสาร");
            } finally {
                setLoading(false);
            }
        }
    };
    
    
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        return () => {
            localStorage.removeItem('formData');
        };
    }, []);

    return (
        <form onSubmit={handleSubmit} className='h-full'>
            {loading && <Loading />}
            <div className='flex flex-row w-full h-full justify-center'>
                <div className='flex flex-col flex-1 p-2'>
                    <h1 className='text-2xl font-semibold'>เพิ่มผู้รับเอกสาร</h1>
                    <div className='flex flex-row justify-start items-start'>
                        <div className='flex flex-col p-4 gap-4 text-lg w-60'>
                            <h1 className='text-blue-500 font-bold'>ข้อมูลผู้ส่ง:</h1>
                            <h1 className='text-blue-500 font-bold'>แผนก:</h1>
                            <h1 className='text-blue-500 font-bold'>ผู้รับเอกสาร:</h1>
                            <h1 className='text-blue-500 font-bold'>หัวข้อดำเนินการ:</h1>
                        </div>
                        <div className='flex flex-col justify-start items-start h-full w-full p-4 gap-4'>
                            <h1 className='text-lg font-semibold'>{`${authUser.firstName} ${authUser.lastName} (${authUser.email})`}</h1>
                            <h1 className='text-lg font-semibold'>{authUser.department}</h1>
                            <div className='flex flex-row gap-4 relative' ref={inputRef}>
                                <input
                                    type="text"
                                    className='rounded-md shadow-md border border-stone-400'
                                    value={search}
                                    onChange={handleInputChange}
                                />
                                <FaMagnifyingGlass className="cursor-pointer hover:text-blue-500 text-3xl text-blue-700" />
                                {showSuggestions && (
                                    <div className='absolute top-full left-0 right-0 bg-white border border-stone-400 rounded-md shadow-lg max-h-60 overflow-y-auto'>
                                        {filteredUsers.map(user => (
                                            <div
                                                key={user.id}
                                                className='p-2 cursor-pointer hover:bg-blue-100'
                                                onClick={() => handleSuggestionClick(user)}
                                            >
                                                {`${user.firstName} ${user.lastName}`}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className='flex flex-col gap-4'>
                                <select
                                    id="topicSelect"
                                    className='rounded-md shadow-md border border-stone-400 p-2'
                                    value={selectedTopic}
                                    onChange={handleTopicChange}
                                >
                                    {Object.keys(topics).map(topic => (
                                        <option key={topic} value={topic}>{topic}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className='h-full w-full mt-2 border border-gray-400 rounded-lg shadow-xl'>
                        {selectedUsers.length > 0 && (
                            <div className='text-xl flex flex-col gap-4 p-4'>
                                {selectedUsers.map(user => (
                                    <div key={user.id} className='border border-gray-200 rounded-lg shadow-2xl p-4 cursor-pointer hover:scale-105'>
                                        <h1><strong className='text-blue-500 font-bold'>Step {user.step}:</strong></h1>
                                        <h1><strong className='text-blue-500 font-bold'>Name:</strong> {`${user.firstName} ${user.lastName}`}</h1>
                                        <h1><strong className='text-blue-500 font-bold'>Email:</strong> {user.email}</h1>
                                        <h1><strong className='text-blue-500 font-bold'>Department:</strong> {user.department}</h1>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className='flex flex-1 justify-center items-center rounded-lg flex-col'>
                    <div className='p-4 h-full w-full border shadow-2xl rounded-lg justify-center'>
                        {formData && (
                            <>
                                <ButtonSmall
                                    onClick={toggleShowContent}
                                    className="p-2 text-white"
                                >
                                    {showContentPdf ? 'แสดงตัวอย่างเอกสารประกอบการพิจารณา' : 'แสดงตัวอย่างแบบฟอร์มขออนุมัติ'}
                                </ButtonSmall>

                                {showContentPdf ? (
                                    contentPdfUrl && (
                                        <embed src={contentPdfUrl} width="100%" height="95%" type="application/pdf"></embed>
                                    )
                                ) : (
                                    supportingDocumentsUrl && (
                                        <embed src={supportingDocumentsUrl} width="100%" height="95%" type="application/pdf"></embed>
                                    )
                                )}
                            </>
                        )}
                    </div>
                    <div className="flex flex-row justify-end items-end gap-8 mt-4">
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
                                เสร็จสิ้น
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
