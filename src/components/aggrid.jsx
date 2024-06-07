import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useDoc } from '../hooks/use-doc';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Loading from "./Loading";
import "../styles.css"

export default function DocTable() {
  
  const { allDoc, loading } = useDoc();
  const [contentPDFUrl, setContentPDFUrl] = useState('');

  const formatDate = (dateString) => {
      const date = new Date(dateString); 
      return date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit'
      });
  };

  const columnDefs = useMemo(() => [
      { field: "id", headerName: "ID", width: 90, filter: true },
      { field: "docNumber", headerName: "Document Number", flex: 1, filter: true },
      { field: "docHeader", headerName: "Subject", flex: 1, filter: true },
      { field: "createdAt", headerName: "Submitted On", flex: 1, filter: true, cellRenderer: (params) => formatDate(params.value) },
      { field: "status", headerName: "Status", flex: 1, filter: true },
      {
          field: "sender",
          headerName: "Sender",
          flex: 1,
          filter: true,
          valueGetter: (params) => {
              return params.data.sender ? `${params.data.sender.firstName} ${params.data.sender.department}` : "No sender info";
          }
      },
      {
          field: "actionButtons",
          headerName: "",
          sizeColumnsToFit:true,
          minWidth: 180,
          resizable: true,
          cellRenderer: (params) => (
            <div className="flex gap-2 justify-center items-center h-full">
              <VisibilityIcon className="cursor-pointer hover:text-blue-800" onClick={() => setContentPDFUrl(params.data.contentPDF)} />
              <EditIcon onClick={() => { /* handle edit */ }} />
              <DeleteForeverIcon onClick={() => { /* handle delete */ }} />
            </div>
          )
      }
  ], []);
  useEffect(() => {
    function resizeGrid() {
        if (gridApi.current && allDoc.length) {
            gridApi.current.sizeColumnsToFit();
        }
    }
    window.addEventListener('resize', resizeGrid);
    resizeGrid();
    return () => {
        window.removeEventListener('resize', resizeGrid);
    };
}, [allDoc]);

  const gridOptions = useMemo(() => ({
      defaultColDef: {
          resizable: true,
          sortable: true,
          filter: true,
          
      },
      domLayout: 'autoHeight',
  }), []);

  const gridApi = useRef(null);

  const onGridReady = useCallback((params) => {
      gridApi.current = params.api;
      params.api.setRowData(allDoc);
  }, [allDoc]);




  const onFilterTextBoxChanged = useCallback(() => {
      const filterText = document.getElementById("filter-text-box").value;
      gridApi.current.setQuickFilter(filterText);
  }, []);

  return (
    <div className="ag-theme-alpine w-full h-full flex flex-row bg-slate-100 rounded-md shadow-2xl">
      {loading && <Loading />}
      <div className="flex-grow overflow-y-scroll">
          <input
            type="text"
            id="filter-text-box"
            placeholder="Quick search..."
            onInput={onFilterTextBoxChanged}
            className="border border-stone-200 p-4 rounded-lg md:w-96 w-36 mb-2 shadow-2xl"
          />
          <AgGridReact
              rowData={allDoc}
              gridOptions={gridOptions}
              columnDefs={columnDefs}
              onGridReady={onGridReady}
          />
      </div>
  <div className="md:w-[380px] w-[200px] flex justify-center items-center overflow-y-scroll rounded-md shadow-2xl">
    {contentPDFUrl ?
        <embed src={contentPDFUrl} width="100%" height="100%" type="application/pdf" />
        :
        <div className="text-center w-full">Select a file</div>
    }
</div>
    </div>
  );
}