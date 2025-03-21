'use client';

import { BookAppointmentRequest, BookAppointmentResponse } from '@/generated/proto/appointment_pb';
import { AppointmentServiceClient } from '@/generated/proto/AppointmentServiceClientPb';
import { useState, useEffect } from 'react';

interface AppointmentFormProps {
  preselectedDoctorId?: number | null;
  preselectedDate?: string;
  preselectedTime?: string;
  onAppointmentSuccess?: () => void;
}

export default function AppointmentForm({
  preselectedDoctorId = null,
  preselectedDate = '',
  preselectedTime = '',
  onAppointmentSuccess
}: AppointmentFormProps) {
  const [formData, setFormData] = useState({
    doctorId: preselectedDoctorId || '',
    patientId: '',
    appointmentDate: preselectedDate || '',
    appointmentTime: preselectedTime || '',
    reason: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState<{ success: boolean; message: string } | null>(null);
  
  // Update form when preselected values change
  useEffect(() => {
    setFormData(prevState => ({
      ...prevState,
      doctorId: preselectedDoctorId || prevState.doctorId,
      appointmentDate: preselectedDate || prevState.appointmentDate,
      appointmentTime: preselectedTime || prevState.appointmentTime,
    }));
  }, [preselectedDoctorId, preselectedDate, preselectedTime]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponse(null);
    
    try {
      const client = new AppointmentServiceClient('http://localhost:8099');
      const request = new BookAppointmentRequest();
      
      request.setDoctorId(Number(formData.doctorId));
      request.setPatientId(Number(formData.patientId));
      request.setAppointmentDate(formData.appointmentDate);
      request.setAppointmentTime(formData.appointmentTime);
      request.setReason(formData.reason);

      client.bookAppointment(request, {}, (err, response: BookAppointmentResponse) => {
        setIsSubmitting(false);
        
        if (err) {
          console.error('Error booking appointment:', err);
          setResponse({ success: false, message: `Error: ${err.message}` });
          return;
        }
        
        setResponse({ 
          success: true, 
          message: `Appointment booked successfully! Appointment ID: ${response.getAppointmentId()}` 
        });
        
        // Call the success callback if provided
        if (onAppointmentSuccess) {
          setTimeout(() => {
            onAppointmentSuccess();
          }, 2000); // Give user time to see success message before UI changes
        }
      });
    } catch (error) {
      setIsSubmitting(false);
      console.error('Error:', error);
      setResponse({ success: false, message: `An unexpected error occurred: ${error}` });
    }
  };

  return (
    <div className="w-full max-w-lg">
      <div className="bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3">Book an Appointment</h2>
        
        {response && (
          <div className={`p-4 mb-6 rounded-lg shadow-inner ${
            response.success 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <div className="flex items-center">
              {response.success ? (
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <span>{response.message}</span>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="doctorId">
              Doctor ID
            </label>
            <input
              className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              id="doctorId"
              name="doctorId"
              type="number"
              placeholder="Enter doctor ID"
              value={formData.doctorId}
              onChange={handleChange}
              required
              disabled={!!preselectedDoctorId}
            />
          </div>
          
          <div className="mb-5">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="patientId">
              Patient ID
            </label>
            <input
              className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              id="patientId"
              name="patientId"
              type="number"
              placeholder="Enter patient ID"
              value={formData.patientId}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-5">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="appointmentDate">
              Appointment Date
            </label>
            <input
              className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              id="appointmentDate"
              name="appointmentDate"
              type="date"
              value={formData.appointmentDate}
              onChange={handleChange}
              required
              disabled={!!preselectedDate}
            />
          </div>
          
          <div className="mb-5">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="appointmentTime">
              Appointment Time
            </label>
            <input
              className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              id="appointmentTime"
              name="appointmentTime"
              type="time"
              value={formData.appointmentTime}
              onChange={handleChange}
              required
              disabled={!!preselectedTime}
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="reason">
              Reason for Visit
            </label>
            <textarea
              className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              id="reason"
              name="reason"
              placeholder="Enter reason for visit"
              value={formData.reason}
              onChange={handleChange}
              required
              rows={4}
            />
          </div>
          
          <div className="flex items-center justify-end">
            <button
              className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md hover:shadow-lg transition-all duration-200 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Booking...
                </span>
              ) : 'Book Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
