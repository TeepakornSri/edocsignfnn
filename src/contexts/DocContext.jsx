import { createContext, useState, useEffect } from "react";
import axios from '../config/axios';
import Swal from 'sweetalert2';

export const DocContext = createContext();

export default function DocContextProvider({ children }) {
  const [allDoc, setAllDoc] = useState([]);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState({});



  const softDeleteDocument = async (docId) => {
    const confirmResult = await Swal.fire({
      title: 'ยืนยันการลบ',
      text: 'คุณแน่ใจหรือไม่ว่าต้องการลบเอกสารนี้?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่',
      cancelButtonText: 'ยกเลิก'
    });

    if (confirmResult.isConfirmed) {
      try {
        await axios.delete(`/content/${docId}/delete`);
        setAllDoc(prevDocs => prevDocs.filter(doc => doc.id !== docId));
        Swal.fire({
          icon: 'success',
          title: 'ลบสำเร็จ',
          text: 'เอกสารถูกลบเรียบร้อยแล้ว',
          confirmButtonText: 'OK'
        });
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถลบเอกสารได้',
          confirmButtonText: 'OK'
        });
      }
    }
  };

  const saveFile = (name, file) => {
    setFiles(prevFiles => ({ ...prevFiles, [name]: file }));
  };

  const getFile = name => files[name];

  return (
    <DocContext.Provider value={{ allDoc, loading, softDeleteDocument, saveFile, getFile }}>
      {children}
    </DocContext.Provider>
  );
}
