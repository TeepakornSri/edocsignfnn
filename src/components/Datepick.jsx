import * as React from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TextField } from '@mui/material';
import { toast } from 'react-toastify';

export default function DatePickerValue({ onStartDateChange, onEndDateChange }) {
  const [startDate, setStartDate] = React.useState(dayjs());
  const [endDate, setEndDate] = React.useState(dayjs());

  const handleStartDateChange = (newValue) => {
    setStartDate(newValue);
    onStartDateChange(newValue);
    if (newValue && endDate && endDate.isBefore(newValue)) {
      setEndDate(null);
      toast.warn("วันเริ่มไม่ควรน้อยกว่าวันที่ต้องการค้นหา");
    }
  };

  const handleEndDateChange = (newValue) => {
    setEndDate(newValue);
    onEndDateChange(newValue);
    if (newValue && startDate && newValue.isBefore(startDate)) {
      toast.error("วันเริ่มไม่ควรน้อยกว่าวันที่ต้องการค้นหา");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{ margin: '16px' }} className='flex gap-4 items-center'>
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={handleStartDateChange}
          renderInput={(params) => <TextField {...params} />}
          maxDate={endDate || dayjs()} 
        />
        <h1 className='font-medium text-xl'>ถึง</h1>
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={handleEndDateChange}
          renderInput={(params) => <TextField {...params} />}
          minDate={startDate} 
          maxDate={dayjs()} 
        />
      </div>
    </LocalizationProvider>
  );
}
