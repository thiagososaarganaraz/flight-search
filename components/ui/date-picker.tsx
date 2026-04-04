"use client"
import React from "react"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DatePicker as MUIDatePicker } from "@mui/x-date-pickers/DatePicker"
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar"
import { CalendarIcon } from "lucide-react"
import { es } from "date-fns/locale"
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay" // NUEVO
import { isSameDay, isAfter, isBefore } from "date-fns" // NUEVO


interface DatePickerProps {
  date?: Date | null
  onDateChange?: (date: Date | null) => void
  placeholder?: string
  disabled?: boolean
}

export function DatePicker({ date, onDateChange, placeholder = "Pick a date", disabled }: DatePickerProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
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
              style: { color: "inherit"},
            },
          },
        }}
      />
    </LocalizationProvider>
  )
}


interface StaticCalendarProps {
  date: Date | null
  onDateChange: (date: Date | null) => void
  minDate?: Date
  departureDate?: Date | null
  returnDate?: Date | null
}

// NUEVO: Renderizador de Día Personalizado
interface CustomDayProps extends PickersDayProps {
  departureDate?: Date | null
  returnDate?: Date | null
}

function CustomDay(props: CustomDayProps) {
  const { day, departureDate, returnDate, outsideCurrentMonth, ...other } = props;

  if (outsideCurrentMonth) {
    return <div style={{ width: 40, height: 40 }} />; 
  }

  // Calculamos en qué estado está este día específico
  const isStart = departureDate && isSameDay(day, departureDate);
  const isEnd = returnDate && isSameDay(day, returnDate);
  const isBetween = departureDate && returnDate && isAfter(day, departureDate) && isBefore(day, returnDate);
  const isSelected = isStart || isEnd;

  let bgStyle: React.CSSProperties = {
    position: 'absolute',
    top: 2,
    bottom: 2,
    backgroundColor: '#3a4454',
    zIndex: 0,
  };

  if (isStart && returnDate) {
    bgStyle = { ...bgStyle, left: '50%', right: 0 }; // Mitad derecha
  } else if (isEnd && departureDate) {
    bgStyle = { ...bgStyle, left: 0, right: '50%' }; // Mitad izquierda
  } else if (isBetween) {
    bgStyle = { ...bgStyle, left: 0, right: 0 }; // Completo
  } else {
    bgStyle = { display: 'none' }; // Sin sombra
  }

  return (
    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', width: 40, height: 40 }}>
      <div style={bgStyle} />
      
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        sx={{
          zIndex: 1,
          backgroundColor: isSelected ? '#8ab4f8 !important' : 'transparent',
          color: isSelected ? '#202124 !important' : (isBetween ? '#e8eaed' : undefined),
          fontWeight: isSelected ? 'bold' : 'normal',
          border: isEnd && !isStart ? '1px solid #8ab4f8' : 'none', // Detalle visual para el cierre
          '&:hover': {
            backgroundColor: isSelected ? '#9dc0f9 !important' : 'rgba(255, 255, 255, 0.08)',
          },
        }}
      />
    </div>
  );
}

export function StaticCalendar({ 
  date, 
  onDateChange, 
  minDate, 
  departureDate, 
  returnDate,
  defaultMonth // <--- Nueva Prop
}: StaticCalendarProps & { defaultMonth?: Date }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <DateCalendar
        value={date || null}
        onChange={onDateChange}
        minDate={minDate || new Date()}
        // NUEVO: Le inyectamos nuestro CustomDay
        referenceDate={date ? undefined : defaultMonth} 
        slots={{ day: CustomDay }}
        slotProps={{
          day: {
            departureDate,
            returnDate,
          } as any, // TypeScript workaround para pasar props custom al slot
        }}
        sx={{
          backgroundColor: 'transparent',
          color: '#e8eaed',
          '& .MuiPickersDay-root': { fontSize: '0.95rem' },
          '& .MuiTypography-root': { color: '#9aa0a6' },
          '& .MuiPickersCalendarHeader-label': { color: '#e8eaed', textTransform: 'capitalize' },
          '& .MuiIconButton-root': { color: '#9aa0a6' },
        }}
      />
    </LocalizationProvider>
  )
}