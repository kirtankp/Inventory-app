"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Home() {

  const router = useRouter()
  const [formData, setFormData] = useState({
    role: 'employee',
    email: ''
  });

  const [showOtpForm, setShowOtpForm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    setShowOtpForm(true);
    e.preventDefault();
    // Handle login logic here (e.g., send data to the server)
    try {
      const response = await axios.post("http://localhost:5001/user/login", formData);
      if (response.data['user']) {
        localStorage.setItem('token', response.data['user'])
        console.log("Login success", response.data);
        router.push("/dashboard");
      } else {
        alert("Login failed")
        console.log("Login failed", response.data);
      }
    } catch (error) {
      console.log("Login failed", error.message);
    }
    console.log(formData)
  };

  return (
    !showOtpForm ? (
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl mb-4">Log In</h2>
        <div className="mb-4">
          <label>
            Role:
            <select className='w-28 text-center m-2 py-1 rounded' name="role" value={formData.role} onChange={handleChange}>
              <option value="store">Store</option>
              <option value="employee">Employee</option>
            </select>
          </label>
        </div>
        <div className="mb-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={formData.email}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="mb-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Generate OTP
        </button>
      </form>
    ) : (
      <>
        <p>Enter OTP sent to your email:</p>
        <input type="text" placeholder="OTP" className="w-full p-2 my-2" />
        <button className="w-full bg-blue-500 text-white p-2 rounded my-2">Submit</button>
      </>
    )
  )
}
