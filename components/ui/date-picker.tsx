"use client"
import React from "react"
import { format } from "date-fns"
import TextField from "@mui/material/TextField"
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
          },
        }}
      />
    </LocalizationProvider>
  )
}
