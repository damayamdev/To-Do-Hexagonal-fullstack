import React, { useState, useEffect } from 'react'
import { format, addMonths, subMonths, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addDays, parseISO, isAfter, isBefore, startOfDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-react'

// Simulación de habitaciones disponibles
const rooms = [
  { id: 101, name: 'Habitación 101' },
  { id: 102, name: 'Habitación 102' },
  { id: 103, name: 'Habitación 103' },
  { id: 104, name: 'Habitación 104' },
]

// Simulación de reservas existentes
const initialReservations = [
  { id: 1, startDate: '2024-09-15', endDate: '2024-09-20', name: 'Juan Pérez', cedula: '1234567890', email: 'juan@example.com', phone: '1234567890', roomId: 101 },
  { id: 2, startDate: '2024-09-25', endDate: '2024-09-28', name: 'María García', cedula: '0987654321', email: 'maria@example.com', phone: '0987654321', roomId: 102 },
]

export default function ReservationCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [reservationDetailsOpen, setReservationDetailsOpen] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState(null)
  const [bookingDetails, setBookingDetails] = useState({
    id: null,
    startDate: '',
    endDate: '',
    name: '',
    cedula: '',
    email: '',
    phone: '',
    roomId: '',
  })
  const [reservations, setReservations] = useState(initialReservations)

  const today = startOfDay(new Date())
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
  const endDate = endOfWeek(monthEnd)

  const dateFormat = "d"
  const days = eachDayOfInterval({ start: startDate, end: endDate })

  const isDateReserved = (date, roomId) => {
    return reservations.some(reservation => 
      (date >= parseISO(reservation.startDate) && date <= parseISO(reservation.endDate) && reservation.roomId === roomId)
    )
  }

  const getReservationsForDate = (date) => {
    return reservations.filter(reservation => 
      (date >= parseISO(reservation.startDate) && date <= parseISO(reservation.endDate))
    )
  }

  const onDateClick = (day) => {
    if (isBefore(day, today)) return
    setSelectedDate(day)
    setBookingDetails({
      id: null,
      startDate: format(day, 'yyyy-MM-dd'),
      endDate: format(addDays(day, 1), 'yyyy-MM-dd'),
      name: '',
      cedula: '',
      email: '',
      phone: '',
      roomId: '',
    })
    setModalOpen(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'endDate') {
      const selectedEndDate = new Date(value)
      if (isBefore(selectedEndDate, today)) return
    }
    setBookingDetails(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (bookingDetails.id) {
      // Actualizar reserva existente
      setReservations(reservations.map(reservation => 
        reservation.id === bookingDetails.id ? { ...bookingDetails, roomId: parseInt(bookingDetails.roomId) } : reservation
      ))
    } else {
      // Crear nueva reserva
      const newReservation = {
        ...bookingDetails,
        id: reservations.length + 1,
        roomId: parseInt(bookingDetails.roomId)
      }
      setReservations([...reservations, newReservation])
    }
    setModalOpen(false)
  }

  const handleReservationClick = (reservation) => {
    setSelectedReservation(reservation)
    setReservationDetailsOpen(true)
  }

  const handleEditReservation = () => {
    setBookingDetails(selectedReservation)
    setReservationDetailsOpen(false)
    setModalOpen(true)
  }

  const handleDeleteReservation = () => {
    setReservations(reservations.filter(r => r.id !== selectedReservation.id))
    setReservationDetailsOpen(false)
  }

  const navigateToToday = () => {
    setCurrentDate(new Date())
  }

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {format(currentDate, 'MMMM yyyy', { locale: es })}
          </h2>
          <div className="flex items-center space-x-2">
            <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 rounded-full hover:bg-gray-200">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              onClick={() => setFilterModalOpen(true)} 
              className="flex items-center space-x-1 px-3 py-2 bg-white border rounded-md shadow-sm hover:bg-gray-50"
            >
              <CalendarIcon className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filtrar</span>
            </button>
            <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 rounded-full hover:bg-gray-200">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              onClick={navigateToToday}
              className="px-3 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700"
            >
              Hoy
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
              <div key={day} className="text-center font-semibold text-sm text-gray-600">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, dayIdx) => {
              const dayReservations = getReservationsForDate(day)
              const isDisabled = isBefore(day, today)
              const isToday = isSameDay(day, today)
              return (
                <div
                  key={dayIdx}
                  className={`p-2 border rounded-md ${
                    !isSameMonth(day, monthStart)
                      ? 'text-gray-400 bg-gray-50'
                      : isDisabled
                      ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                      : isToday
                      ? 'bg-blue-100 hover:bg-blue-200'
                      : 'hover:bg-gray-100'
                  } ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} transition-colors duration-200`}
                  onClick={() => !isDisabled && onDateClick(day)}
                >
                  <span className="text-sm font-medium">{format(day, dateFormat)}</span>
                  {dayReservations.map((reservation) => (
                    <div 
                      key={reservation.id}
                      className="mt-1 text-xs font-medium text-blue-800 truncate cursor-pointer hover:underline"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleReservationClick(reservation)
                      }}
                    >
                      ID: {reservation.id}, Hab: {reservation.roomId}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-w-full">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              {bookingDetails.id ? 'Editar Reserva' : 'Nueva Reserva'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Fecha de inicio</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={bookingDetails.startDate}
                  min={format(today, 'yyyy-MM-dd')}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Fecha de fin</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={bookingDetails.endDate}
                  min={format(addDays(parseISO(bookingDetails.startDate), 1), 'yyyy-MM-dd')}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="roomId" className="block text-sm font-medium text-gray-700">Habitación</label>
                <select
                  id="roomId"
                  name="roomId"
                  value={bookingDetails.roomId}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                >
                  <option value="">Seleccione una habitación</option>
                  {rooms.map(room => (
                    <option 
                      key={room.id} 
                      value={room.id}
                      disabled={isDateReserved(parseISO(bookingDetails.startDate), room.id) && room.id !== bookingDetails.roomId}
                    >
                      {room.name} {isDateReserved(parseISO(bookingDetails.startDate), room.id) && room.id !== bookingDetails.roomId ? '(No disponible)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={bookingDetails.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="cedula" className="block text-sm font-medium text-gray-700">Cédula</label>
                <input
                  type="text"
                  id="cedula"
                  name="cedula"
                  value={bookingDetails.cedula}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={bookingDetails.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={bookingDetails.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {bookingDetails.id ? 'Actualizar' : 'Reservar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {filterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Seleccionar fecha</h3>
              <button onClick={() => setFilterModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 12 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentDate(new Date(currentDate.getFullYear(), i, 1))
                    setFilterModalOpen(false)
                  }}
                  className="p-2 text-center text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  {format(new Date(currentDate.getFullYear(), i, 1), 'MMM', { locale: es })}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {reservationDetailsOpen && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-w-full">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Detalles de la Reserva</h3>
            <div className="space-y-2">
              <p><strong>ID:</strong> {selectedReservation.id}</p>
              <p><strong>Nombre:</strong> {selectedReservation.name}</p>
              <p><strong>Cédula:</strong> {selectedReservation.cedula}</p>
              <p><strong>Email:</strong> {selectedReservation.email}</p>
              <p><strong>Teléfono:</strong> {selectedReservation.phone}</p>
              <p><strong>Fecha de inicio:</strong> {selectedReservation.startDate}</p>
              <p><strong>Fecha de fin:</strong> {selectedReservation.endDate}</p>
              <p><strong>Habitación:</strong> {rooms.find(room => room.id === selectedReservation.roomId)?.name}</p>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setReservationDetailsOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cerrar
              </button>
              <button
                onClick={handleEditReservation}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Editar
              </button>
              <button
                onClick={handleDeleteReservation}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}