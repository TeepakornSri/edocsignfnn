import { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import axios from '../config/axios';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import Loading from "./Loading";
import "../styles.css";
import DatePickerValue from "./Datepick";
import dayjs from "dayjs";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Swal from 'sweetalert2';
import { FaMagnifyingGlass } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { useDoc } from '../hooks/use-doc';
import { Link, useNavigate } from "react-router-dom";

export default function DocTable() {
  const [allDoc, setAllDoc] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contentPDFUrl, setContentPDFUrl] = useState('');
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [startDate, setStartDate] = useState(dayjs().startOf('month'));
  const [endDate, setEndDate] = useState(dayjs().endOf('month'));
  const { softDeleteDocument } = useDoc(); 
  const [DocbyId, setDocById] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios.get('/content/showalldoc')
      .then(res => {
        setAllDoc(res.data.documents);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'ไม่สามารถโหลดข้อมูลได้',
          confirmButtonText: 'OK'
        });
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!allDoc || allDoc.length === 0) {
      console.log('No documents available or still loading');
      return;
    }
    const filtered = allDoc.filter(doc => {
      const docDate = dayjs(doc.createdAt);
      return docDate.isBetween(startDate, endDate, null, '[]') && !doc.deleted;
    });
    setFilteredDocs(filtered);
  }, [allDoc, startDate, endDate]);

  const handleStartDateChange = newValue => {
    const newStartDate = dayjs(newValue).startOf('day');
    console.log('New Start Date:', newStartDate);
    setStartDate(newStartDate);
  };

  const handleEndDateChange = newValue => {
    const newEndDate = dayjs(newValue).endOf('day');
    console.log('New End Date:', newEndDate);
    setEndDate(newEndDate);
  };

  const formatDate = dateString => dayjs(dateString).format('DD/MM/YYYY');

  const handleSoftDelete = async (docId) => {
    const docToDelete = allDoc.find(doc => doc.id === docId);

    if (docToDelete.status !== 'PENDING') {
      Swal.fire({
        icon: 'error',
        title: 'ไม่สามารถลบได้',
        text: 'เอกสารนี้ไม่อยู่ในสถานะ PENDING และไม่สามารถลบได้',
        confirmButtonText: 'OK'
      });
      return;
    }

    const confirmResult = await Swal.fire({
      title: 'ยืนยันการลบ',
      text: 'คุณแน่ใจหรือไม่ว่าต้องการลบเอกสารนี้?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่',
      cancelButtonText: 'ยกเลิก'
    });

    if (confirmResult.isConfirmed) {
      await softDeleteDocument(docId);
      setAllDoc(prevDocs => prevDocs.map(doc => doc.id === docId ? { ...doc, deleted: true } : doc));
    }
  };

  const handleEditClick = (params) => {
    if (params.data.status !== 'PENDING') {
      Swal.fire({
        icon: 'error',
        title: 'ไม่สามารถแก้ไขได้',
        text: 'เอกสารนี้ไม่อยู่ในสถานะ PENDING และไม่สามารถแก้ไขได้',
        confirmButtonText: 'OK'
      });
    } else {
      setDocById(params.data);
      navigate(`/upload/update/${params.data.id}`);
    }
  };

  const togglePDFViewer = (url) => {
    setContentPDFUrl(prevUrl => prevUrl === url ? '' : url);
  };

  const columnDefs = useMemo(() => [
    { field: "id", headerName: "ID", width: 90, filter: true },
    { field: "docNumber", headerName: "Document Number", flex: 1, filter: true },
    {
      field: "docHeader",
      headerName: "Subject",
      flex: 1,
      filter: true,
      autoHeight: true,
      cellRenderer: params => (
        <div style={{ whiteSpace: 'normal', overflowWrap: 'break-word', lineHeight: '1.5' }}>
          {params.value}
        </div>
      ),
      cellStyle: { whiteSpace: 'normal', wordWrap: 'break-word' }
    },
    { field: "createdAt", headerName: "Submitted On", flex: 1, filter: true, cellRenderer: params => formatDate(params.value) },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      filter: true,
      cellStyle: params => {
        if (params.value === 'PENDING') {
          return { color: '#DAA520' };
        } else if (params.value === 'APPROVED') {
          return { color: 'green' };
        } else if (params.value === 'REJECT') {
          return { color: 'red' };
        } else {
          return null;
        }
      }
    },
    { field: "sender", headerName: "Sender", flex: 1, filter: true, valueGetter: params => params.data.sender ? `${params.data.sender.firstName} ${params.data.sender.department}` : "No sender info" },
    {
      field: "actionButtons", headerName: "", minWidth: 180, resizable: true, cellRenderer: params => (
        <div className="flex gap-2 justify-start items-start h-full">
          <FaMagnifyingGlass className="cursor-pointer hover:text-blue-800 text-3xl" onClick={() => togglePDFViewer(params.data.contentPDF)} />
          <MdEdit className="cursor-pointer hover:text-blue-800 text-3xl" onClick={() => handleEditClick(params)} />
          <MdDeleteForever className="cursor-pointer hover:text-red-500 text-3xl" onClick={() => handleSoftDelete(params.data.id)} />
        </div>
      )
    }
  ], [softDeleteDocument]);

  const gridOptions = useMemo(() => ({
    defaultColDef: {
      resizable: true,
      sortable: true,
      filter: true,
    },
    domLayout: 'autoHeight',
  }), []);

  const gridApi = useRef(null);

  const onGridReady = useCallback(params => {
    gridApi.current = params.api;
    console.log('Grid API set:', gridApi.current);
  }, []);

  useEffect(() => {
    if (!gridApi.current || !filteredDocs.length) return;
    console.log("Setting row data:", filteredDocs);
    gridApi.current.updateGridOptions({ rowData: filteredDocs });
  }, [filteredDocs]);

  useEffect(() => {
    const resizeGrid = () => {
      gridApi.current?.sizeColumnsToFit();
    };
    window.addEventListener('resize', resizeGrid);
    return () => window.removeEventListener('resize', resizeGrid);
  }, []);

  const onFilterTextBoxChanged = useCallback(() => {
    const filterText = document.getElementById("filter-text-box").value;
    gridApi.current?.setQuickFilter(filterText);
    console.log('Filter applied:', filterText);
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="ag-theme-alpine w-full h-full flex flex-row bg-slate-100 rounded-md shadow-2xl">
        {loading ? <Loading /> : (
          <>
            <div className={`flex-grow overflow-y-scroll transition-all duration-500 ${contentPDFUrl ? 'md:w-2/3 w-full' : 'w-full'}`}>
              <div className="flex flex-row justify-start items-center mb-2">
                <input
                  type="text"
                  id="filter-text-box"
                  placeholder="Quick search..."
                  onInput={onFilterTextBoxChanged}
                  className="border border-stone-200 p-4 rounded-lg md:w-96 w-36 shadow-2xl"
                />
                <DatePickerValue
                  onStartDateChange={handleStartDateChange}
                  onEndDateChange={handleEndDateChange}
                />
              </div>
              <AgGridReact
                rowData={filteredDocs}
                gridOptions={gridOptions}
                columnDefs={columnDefs}
                onGridReady={onGridReady}
                domLayout='autoHeight'
                getRowHeight={params => {
                  if (params.node.level === 0) {
                    const lineHeight = 16;
                    const textLength = params.data.docHeader.length;
                    const charPerLine = 30;
                    const lines = Math.ceil(textLength / charPerLine);
                    return lines * lineHeight + 20; 
                  }
                  return 25;
                }}
              />
            </div>
            <div className={`transition-all duration-500 overflow-y-scroll rounded-md shadow-2xl ${contentPDFUrl ? 'md:w-1/3 w-full' : 'w-0'}`}>
              {contentPDFUrl && (
                <embed src={contentPDFUrl} width="100%" height="100%" type="application/pdf" />
              )}
            </div>
          </>
        )}
      </div>
    </LocalizationProvider>
  );
}
