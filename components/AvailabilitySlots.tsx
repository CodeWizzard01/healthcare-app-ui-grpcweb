'use client';

import { useState, useEffect } from 'react';
import { 
  AppointmentServiceClient 
} from '@/generated/proto/AppointmentServiceClientPb';
import { 
  AppointmentAvailabilityRequest,
  AppointmentAvailabilityResponse,
  AppointmentSlot
} from '@/generated/proto/appointment_pb';

interface AvailabilitySlotsProps {
  doctorId: number | null;
  onSlotSelect: (slot: AppointmentSlot.AsObject) => void;
}

export default function AvailabilitySlots({ 
  doctorId, 
  onSlotSelect 
}: AvailabilitySlotsProps) {
  const [slots, setSlots] = useState<AppointmentSlot.AsObject[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    if (!doctorId) return;
    
    setLoading(true);
    setError(null);
    setSlots([]);
    
    const client = new AppointmentServiceClient('http://localhost:8099');
    const request = new AppointmentAvailabilityRequest();
    request.setDoctorId(doctorId);
    
    const stream = client.getAppointmentAvailability(request);
    
    stream.on('data', (response: AppointmentAvailabilityResponse) => {
      setLastUpdated(response.getAvailabilityAsOf());
      const newSlots = response.getResponsesList().map(slot => ({
        appointmentDate: slot.getAppointmentDate(),
        appointmentTime: slot.getAppointmentTime(),
        isAvailable: slot.getIsAvailable(),
      }));
      console.log(newSlots);
      setSlots(newSlots);
    });
    
    stream.on('error', (err) => {
      console.error('Error fetching availability:', err);
      setError(`Failed to fetch availability: ${err.message}`);
      setLoading(false);
    });
    
    stream.on('end', () => {
      setLoading(false);
    });
    
    return () => {
      stream.cancel();
    };
  }, [doctorId]);
  
  // Group slots by date - Include all slots, not just available ones
  const slotsByDate = slots.reduce((acc: Record<string, typeof slots>, slot) => {
    if (!acc[slot.appointmentDate]) {
      acc[slot.appointmentDate] = [];
    }
    acc[slot.appointmentDate].push(slot);
    return acc;
  }, {});

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long', 
      day: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading && slots.length === 0) {
    return (
      <div className="mt-6 w-full rounded-lg bg-white p-8 shadow-md animate-pulse">
        <div className="h-6 w-3/4 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 w-1/2 bg-gray-200 rounded mb-6"></div>
        <div className="space-y-4">
          <div className="h-20 bg-gray-100 rounded-md"></div>
          <div className="h-20 bg-gray-100 rounded-md"></div>
          <div className="h-20 bg-gray-100 rounded-md"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 w-full rounded-lg bg-red-50 border border-red-200 p-6 text-red-700">
        <h3 className="text-xl font-semibold mb-2">Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (slots.length === 0 && !loading) {
    return (
      <div className="mt-6 w-full rounded-lg bg-amber-50 border border-amber-200 p-6 text-amber-700">
        <h3 className="text-xl font-semibold mb-2">No Availability</h3>
        <p>There are currently no available slots for this doctor</p>
      </div>
    );
  }

  return (
    <div className="mt-6 w-full bg-white rounded-lg shadow-md p-6">
      <h3 className="text-2xl font-semibold mb-3 text-gray-800">Available Appointments</h3>
      {lastUpdated && (
        <p className="text-sm text-gray-600 mb-6 italic">
          Last updated: {new Date(lastUpdated).toLocaleString()}
        </p>
      )}
      
      <div className="space-y-6">
        {Object.keys(slotsByDate).map(date => (
          <div key={date} className="pb-6 border-b border-gray-100 last:border-0">
            <h4 className="text-lg font-medium mb-3 text-gray-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(date)}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {slotsByDate[date].map((slot, idx) => (
                <button
                  key={`${slot.appointmentDate}-${slot.appointmentTime}-${idx}`}
                  className={`px-4 py-3 rounded-md transition-all duration-200 text-center
                    ${slot.isAvailable 
                      ? 'bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 hover:border-green-300 hover:shadow' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                  onClick={() => slot.isAvailable && onSlotSelect(slot)}
                  disabled={!slot.isAvailable}
                >
                  {formatTime(slot.appointmentTime)}
                  <div className="text-xs mt-1">
                    {slot.isAvailable ? 'Available' : 'Unavailable'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
