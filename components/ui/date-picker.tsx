"use client"

import * as React from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date?: Date
  setDate: (date: Date | undefined) => void
  placeholder?: string
  format?: string
  className?: string
}

export function DatePicker({
  date,
  setDate,
  placeholder = "Seleccionar fecha",
  format: dateFormat = "PPP",
  className,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, dateFormat, { locale: es }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            if (selectedDate instanceof Date) {
              setDate(selectedDate)
            }
          }}
          locale={es}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

// Componente de demostración mantenido por compatibilidad
export function DatePickerDemo() {
  const [date, setDate] = React.useState<Date>()
  return <DatePicker date={date} setDate={setDate} placeholder="Seleccionar fecha" />
}
