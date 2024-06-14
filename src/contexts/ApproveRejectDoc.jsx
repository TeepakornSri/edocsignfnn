// import React, { useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import Swal from 'sweetalert2';
// import Loading from '../components/Loading';

// export default function ApproveRejectDocument() {
//     const { docId, recipientId, action } = useParams();
//     const navigate = useNavigate();

//     useEffect(() => {
//         const approveOrReject = async () => {
//             try {
//                 if (action === 'approve') {
//                     await axios.post(`/api/document/approve/${docId}/${recipientId}`);
//                     Swal.fire('อนุมัติสำเร็จ', 'เอกสารถูกอนุมัติเรียบร้อยแล้ว', 'success');
//                 } else if (action === 'reject') {
//                     await axios.post(`/api/document/reject/${docId}/${recipientId}`);
//                     Swal.fire('ปฏิเสธสำเร็จ', 'เอกสารถูกปฏิเสธเรียบร้อยแล้ว', 'success');
//                 }
//                 navigate('/homepage');
//             } catch (error) {
//                 toast.error('เกิดข้อผิดพลาดในการอัปเดตสถานะเอกสาร');
//             }
//         };

//         approveOrReject();
//     }, [action, docId, recipientId, navigate]);

//     return (
//         <div>
//             <Loading />
//         </div>
//     );
// }
