import React from "react";
import DatePicker from "react-datepicker";

type DateInputProps = {
  label: string;
  selectedDate: Date;
  onChange: (date: Date | null) => void;
};

const DateInput: React.FC<DateInputProps> = ({
  label,
  selectedDate,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-1 min-w-[200px]">
      <label className="font-semibold">{label}</label>
      <DatePicker
        className="p-2 flex flex-1 items-center shadow-md rounded-xl outline-none border-none"
        selected={selectedDate}
        enableTabLoop={false}
        onChange={onChange}
      />
    </div>
  );
};

export default DateInput;
