'use client';

import { useState } from 'react';
import AppointmentForm from '../components/AppointmentForm';
import DoctorSelector from '../components/DoctorSelector';
import AvailabilitySlots from '../components/AvailabilitySlots';

interface AppointmentSlot {
  appointmentDate: string;
  appointmentTime: string;
  isAvailable: boolean;
}

export default function Home() {
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AppointmentSlot | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  const handleDoctorSelect = (doctorId: number) => {
    setSelectedDoctorId(doctorId);
    setSelectedSlot(null);
    setShowForm(false);
  };
  
  const handleSlotSelect = (slot: AppointmentSlot) => {
    setSelectedSlot(slot);
    setShowForm(true);
  };
  
  const handleAppointmentSuccess = () => {
    setShowForm(false);
    setSelectedSlot(null);
  };

  
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Healthcare Appointment Booking</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select a doctor, choose an available time slot, and book your appointment online.
          </p>
        </div>
        
        <div className={`${showForm ? 'flex flex-col md:flex-row gap-8' : ''}`}>
          <div className={`${showForm ? 'w-full md:w-1/2' : 'w-full max-w-4xl mx-auto'} transition-all duration-300`}>
            <DoctorSelector onDoctorSelect={handleDoctorSelect} />
            
            {selectedDoctorId && (
              <AvailabilitySlots 
                doctorId={selectedDoctorId} 
                onSlotSelect={handleSlotSelect} 
              />
            )}
          </div>
          
          {showForm && selectedSlot && (
            <div className="w-full md:w-1/2 mt-8 md:mt-0 transition-all duration-300 ease-in-out">
              <div className="bg-white rounded-xl shadow-md p-6 mb-4">
                <h3 className="text-xl font-medium mb-2 text-gray-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Selected Appointment
                </h3>
                <p className="text-gray-600 mb-1">
                  <strong>Date:</strong> {new Date(selectedSlot.appointmentDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-gray-600">
                  <strong>Time:</strong> {new Date(`2000-01-01T${selectedSlot.appointmentTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                </p>
              </div>
              <AppointmentForm 
                preselectedDoctorId={selectedDoctorId} 
                preselectedDate={selectedSlot.appointmentDate}
                preselectedTime={selectedSlot.appointmentTime}
                onAppointmentSuccess={handleAppointmentSuccess}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
