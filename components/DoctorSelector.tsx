'use client';

import { useState } from 'react';

// Mock data for doctors - in a real application, this would come from an API
const MOCK_DOCTORS = [
  { id: 1, name: 'Dr. John Smith', specialty: 'Cardiology' },
  { id: 2, name: 'Dr. Sarah Johnson', specialty: 'Dermatology' },
  { id: 3, name: 'Dr. Michael Chang', specialty: 'Orthopedics' },
  { id: 4, name: 'Dr. Emily Rodriguez', specialty: 'Pediatrics' },
];

interface DoctorSelectorProps {
  onDoctorSelect: (doctorId: number) => void;
}

export default function DoctorSelector({ onDoctorSelect }: DoctorSelectorProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<number | ''>('');

  const handleDoctorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const doctorId = parseInt(e.target.value);
    setSelectedDoctor(doctorId);
    onDoctorSelect(doctorId);
  };

  return (
    <div className="w-full max-w-md mb-8">
      <label className="block text-gray-700 text-lg font-semibold mb-3" htmlFor="doctor">
        Select a Doctor
      </label>
      <div className="relative">
        <select
          id="doctor"
          className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-3 pr-8 rounded-lg shadow-sm leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          value={selectedDoctor}
          onChange={handleDoctorChange}
        >
          <option value="" disabled>Select a doctor</option>
          {MOCK_DOCTORS.map(doctor => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name} - {doctor.specialty}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
          <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
