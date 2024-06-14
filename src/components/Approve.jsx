import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const ApproveReject = () => {
  const { docId, recipientId, action } = useParams();
  const [message, setMessage] = useState('กำลังดำเนินการ...');
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const performAction = async () => {
      try {
        const response = await axios.get(`/content/approve/${docId}/${recipientId}/${action}`);
        if (response.status === 200) {
          if (action === 'approve') {
            setMessage('APPROVED');
          } else if (action === 'reject') {
            setMessage('REJECTED');
          }
        } else {
          setMessage('เกิดข้อผิดพลาดในการดำเนินการ');
        }
      } catch (error) {
        setMessage('เกิดข้อผิดพลาดในการดำเนินการ');
      }
    };

    performAction();
  }, [docId, recipientId, action]);

  useEffect(() => {
    if (message !== 'กำลังดำเนินการ...') {
      let icon = 'success';
      let title = '';

      if (message === 'APPROVED') {
        title = 'อนุมัติเรียบร้อย';
      } else if (message === 'REJECTED') {
        title = 'ปฏิเสธเรียบร้อย';
        icon = 'error';
      } else {
        title = 'เกิดข้อผิดพลาด';
        icon = 'error';
      }

      Swal.fire({
        position: 'center',
        icon: icon,
        title: title,
        showConfirmButton: false,
        timer: 3000
      }).then(() => {
        setShowContent(true);
      });
    }
  }, [message]);

  return (
    <div className='flex justify-center items-center h-screen w-full'>
      {showContent && (
        <div>
          <h1 className='font-extrabold text-4xl'>ดำเนินการเรียบร้อยสามารถปิดหน้าต่างนี้ได้</h1>
        </div>
      )}
    </div>
  );
};

export default ApproveReject;
