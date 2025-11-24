"use client";

import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaIdCard,
  FaExclamationCircle,
  FaCheckCircle,
  FaInfoCircle
} from "react-icons/fa";

// Reusable input field with validation icons and blur handling
const InputField = React.memo(({
  label,
  type,
  value,
  onChange,
  onBlur,
  placeholder,
  required,
  icon: Icon,
  status,
  error
}) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
          status === 'error' ? 'text-red-400' : status === 'success' ? 'text-green-400' : 'text-gray-400'
        }`} />
      )}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={e => onBlur(e.target.value)}
        placeholder={placeholder}
        className={`w-full ${Icon ? 'pl-10' : 'pl-3'} pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
          status === 'error'
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
            : status === 'success'
            ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
        }`}
      />
      {status === 'success' && <FaCheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" />}
      {status === 'error' && <FaExclamationCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500" />}
    </div>
    {error && (
      <p className="text-sm text-red-600 flex items-center">
        <FaExclamationCircle className="mr-1" />
        {error}
      </p>
    )}
  </div>
));

const TravelerInfoStep = ({
  travelerDetails,
  setTravelerDetails,
  handleNextStep,
  handlePreviousStep,
  bookingData,
}) => {
  const [errors, setErrors] = useState({});
  const [validationStatus, setValidationStatus] = useState({});

  const validateField = (field, value, idx) => {
    const key = `${idx}-${field}`;
    const newErr = {};
    const newStat = {};

    switch (field) {
      case 'title':
        if (!value) {
          newErr[key] = 'Please select a title';
          newStat[key] = 'error';
        } else {
          newStat[key] = 'success';
        }
        break;
      case 'fullName':
        if (!value.trim()) {
          newErr[key] = 'Full name is required';
          newStat[key] = 'error';
        } else if (value.trim().length < 2) {
          newErr[key] = 'Name must be at least 2 characters';
          newStat[key] = 'error';
        } else {
          newStat[key] = 'success';
        }
        break;
      case 'dateOfBirth':
        if (!value) {
          newErr[key] = 'Date of birth is required';
          newStat[key] = 'error';
        } else {
          const age = Math.floor((new Date() - new Date(value)) / (365.25 * 24 * 3600 * 1000));
          if (age < 0 || age > 120) {
            newErr[key] = 'Please enter a valid date';
            newStat[key] = 'error';
          } else {
            newStat[key] = 'success';
          }
        }
        break;
      case 'email':
        if (!/\S+@\S+\.\S+/.test(value)) {
          newErr[key] = 'Enter a valid email';
          newStat[key] = 'error';
        } else {
          newStat[key] = 'success';
        }
        break;
      case 'phone':
        if (!/^\d{10}$/.test(value)) {
          newErr[key] = 'Enter a 10-digit number';
          newStat[key] = 'error';
        } else {
          newStat[key] = 'success';
        }
        break;
      default:
        return;
    }

    setErrors(prev => ({ ...prev, ...newErr }));
    setValidationStatus(prev => ({ ...prev, ...newStat }));
  };

  const handleInputChange = (idx, field, value) => {
    setTravelerDetails(prev => {
      const arr = [...prev]; arr[idx] = { ...arr[idx], [field]: value }; return arr;
    });
  };

  const handleBlur = (idx, field, value) => validateField(field, value, idx);

  const handleSubmit = () => {
    let errs = {};
    let stats = {};
    let hasError = false;

    travelerDetails.forEach((t, idx) => {
      ['title','fullName','dateOfBirth'].forEach(fld => {
        if (!t[fld]) { errs[`${idx}-${fld}`] = `${fld} required`; stats[`${idx}-${fld}`] = 'error'; hasError = true; }
      });
      if (idx === 0) ['email','phone'].forEach(fld => {
        if (!t[fld]) { errs[`${idx}-${fld}`] = `${fld} required`; stats[`${idx}-${fld}`] = 'error'; hasError = true; }
      });
    });

    setErrors(prev => ({ ...prev, ...errs }));
    setValidationStatus(prev => ({ ...prev, ...stats }));

    if (!hasError) handleNextStep();
  };

  const getPassengerType = idx =>
    idx < bookingData.passengers.adults ? 'Adult' :
    idx < bookingData.passengers.adults + bookingData.passengers.children ? 'Child' :
    'Infant';

  const getStatus = (i,f) => validationStatus[`${i}-${f}`];
  const getError = (i,f) => errors[`${i}-${f}`];

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl">
      <div className="flex items-center mb-6">
        <div className="bg-green-100 p-3 rounded-full mr-4"><FaUser className="text-green-600"/></div>
        <div>
          <h2 className="text-xl font-semibold">Traveler Information</h2>
          <p className="text-gray-600">Match exactly your ID documents</p>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded mb-6 border border-blue-200">
        <div className="flex"><FaInfoCircle className="text-blue-600 mr-2"/>
          <div>
            <h4 className="font-medium">Guidelines</h4>
            <ul className="list-disc list-inside text-sm text-blue-700">
              <li>Names must match your ID</li>
              <li>Contact used for updates</li>
              <li>Fields with * are required</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {travelerDetails.map((trav, i) => (
          <div key={i} className="bg-gray-50 p-6 rounded-lg border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="flex items-center"><div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">{i+1}</div>Traveler {i+1}</h3>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getPassengerType(i)==='Adult'? 'bg-blue-100 text-blue-800': getPassengerType(i)==='Child'? 'bg-green-100 text-green-800':'bg-purple-100 text-purple-800'}`}>{getPassengerType(i)}</span>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Title <span className="text-red-500">*</span></label>
                <select
                  value={trav.title}
                  onChange={e=>handleInputChange(i,'title',e.target.value)}
                  onBlur={e=>handleBlur(i,'title',e.target.value)}
                  className={`w-full p-3 border rounded focus:ring-2 transition ${getStatus(i,'title')==='error'?'border-red-300 ring-red-500':'border-gray-300 ring-blue-500'}`}
                >
                  <option value="">Select</option>
                  <option value="Mr.">Mr.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Dr.">Dr.</option>
                </select>
                {getError(i,'title') && <p className="text-red-600 mt-1 text-sm"><FaExclamationCircle className="inline mr-1"/>{getError(i,'title')}</p>}
              </div>
              <InputField label="Full Name" type="text" value={trav.fullName} onChange={v=>handleInputChange(i,'fullName',v)} onBlur={v=>handleBlur(i,'fullName',v)} placeholder="Name as per ID" required icon={FaUser} status={getStatus(i,'fullName')} error={getError(i,'fullName')} />
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <InputField label="Date of Birth" type="date" value={trav.dateOfBirth} onChange={v=>handleInputChange(i,'dateOfBirth',v)} onBlur={v=>handleBlur(i,'dateOfBirth',v)} required icon={FaIdCard} status={getStatus(i,'dateOfBirth')} error={getError(i,'dateOfBirth')} />
            </div>

            {i===0 && <>
              <h4 className="mt-4 mb-2 font-medium flex items-center"><FaEnvelope className="mr-2 text-blue-600"/>Contact Information</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <InputField label="Email" type="email" value={trav.email} onChange={v=>handleInputChange(i,'email',v)} onBlur={v=>handleBlur(i,'email',v)} placeholder="you@example.com" required icon={FaEnvelope} status={getStatus(i,'email')} error={getError(i,'email')} />
                <InputField label="Phone" type="tel" value={trav.phone} onChange={v=>handleInputChange(i,'phone',v)} onBlur={v=>handleBlur(i,'phone',v)} placeholder="10-digit number" required icon={FaPhone} status={getStatus(i,'phone')} error={getError(i,'phone')} />
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <InputField label="Address" type="text" value={trav.address} onChange={v=>handleInputChange(i,'address',v)} onBlur={v=>handleBlur(i,'address',v)} placeholder="Complete address" icon={FaMapMarkerAlt} status={getStatus(i,'address')} error={getError(i,'address')} />
                <InputField label="State" type="text" value={trav.state} onChange={v=>handleInputChange(i,'state',v)} onBlur={v=>handleBlur(i,'state',v)} placeholder="State" icon={FaMapMarkerAlt} status={getStatus(i,'state')} error={getError(i,'state')} />
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <InputField label="Pin Code" type="text" value={trav.pinCode} onChange={v=>handleInputChange(i,'pinCode',v)} onBlur={v=>handleBlur(i,'pinCode',v)} placeholder="6-digit PIN code" icon={FaMapMarkerAlt} status={getStatus(i,'pinCode')} error={getError(i,'pinCode')} />
                <InputField label="GST Number (Optional)" type="text" value={trav.gstNumber} onChange={v=>handleInputChange(i,'gstNumber',v)} onBlur={v=>handleBlur(i,'gstNumber',v)} placeholder="For business travel" icon={FaIdCard} status={getStatus(i,'gstNumber')} error={getError(i,'gstNumber')} />
              </div>
            </>}
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={handlePreviousStep} className="px-5 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">← Back</button>
        <button onClick={handleSubmit} className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700">Continue →</button>
      </div>
    </div>
  );
};

export default TravelerInfoStep;
