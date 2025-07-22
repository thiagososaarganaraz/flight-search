"use client"
import React from "react"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DatePicker as MUIDatePicker } from "@mui/x-date-pickers/DatePicker"
import { CalendarIcon } from "lucide-react"

interface DatePickerProps {
  date?: Date
  onDateChange?: (date: Date | null) => void
  placeholder?: string
  disabled?: boolean
}

export function DatePicker({ date, onDateChange, placeholder = "Pick a date", disabled }: DatePickerProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MUIDatePicker
        value={date || null}
        onChange={onDateChange}
        disabled={disabled}
        minDate={new Date()}
        slots={{
          openPickerIcon: CalendarIcon,
        }}
        slotProps={{
          textField: {
            fullWidth: true,
            placeholder,
            variant: "outlined",
            size: "small",
            InputProps: {
              style: { color: "inherit" },
            },
          },
        }}
      />
    </LocalizationProvider>
  )
}
