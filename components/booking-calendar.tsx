'use client'

import { useState } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday,
  isBefore,
  startOfDay,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Booking = {
  id: string
  user_id: string
  booking_date: string
  time_slot: 'morning' | 'afternoon'
  customer_name: string
  customer_phone: string | null
  notes: string | null
  created_at: string
}

type BookingCalendarProps = {
  bookings: Booking[]
  selectedDate: Date | null
  onSelectDate: (date: Date) => void
  currentMonth: Date
  onMonthChange: (date: Date) => void
}

export function BookingCalendar({
  bookings,
  selectedDate,
  onSelectDate,
  currentMonth,
  onMonthChange,
}: BookingCalendarProps) {
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const getBookingsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return bookings.filter((b) => b.booking_date === dateStr)
  }

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onMonthChange(subMonths(currentMonth, 1))}
          className="text-muted-foreground hover:text-foreground hover:bg-secondary"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Mes anterior</span>
        </Button>
        <h2 className="text-lg font-bold uppercase tracking-wider text-foreground">
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onMonthChange(addMonths(currentMonth, 1))}
          className="text-muted-foreground hover:text-foreground hover:bg-secondary"
        >
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Proximo mes</span>
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground"
          >
            {day}
          </div>
        ))}

        {days.map((day) => {
          const dayBookings = getBookingsForDate(day)
          const isSelected = selectedDate && isSameDay(day, selectedDate)
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const isPast = isBefore(startOfDay(day), startOfDay(new Date()))
          const isFull = dayBookings.length >= 2

          return (
            <button
              key={day.toISOString()}
              onClick={() => !isPast && onSelectDate(day)}
              disabled={isPast}
              className={`
                relative flex flex-col items-center rounded-md p-2 text-sm transition-all
                ${!isCurrentMonth ? 'text-muted-foreground/30' : ''}
                ${isPast && isCurrentMonth ? 'text-muted-foreground/50 cursor-not-allowed' : ''}
                ${isSelected ? 'bg-primary text-primary-foreground' : ''}
                ${!isSelected && isCurrentMonth && !isPast ? 'hover:bg-secondary text-foreground cursor-pointer' : ''}
                ${isToday(day) && !isSelected ? 'ring-1 ring-primary' : ''}
              `}
            >
              <span className="font-semibold">{format(day, 'd')}</span>
              {isCurrentMonth && dayBookings.length > 0 && (
                <div className="mt-1 flex gap-0.5">
                  {dayBookings.map((b) => (
                    <span
                      key={b.id}
                      className={`h-1.5 w-1.5 rounded-full ${
                        isSelected ? 'bg-primary-foreground' : 'bg-primary'
                      }`}
                    />
                  ))}
                </div>
              )}
              {isCurrentMonth && isFull && !isSelected && (
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-destructive" />
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span>Agendado</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-destructive" />
          <span>Lotado</span>
        </div>
      </div>
    </div>
  )
}
