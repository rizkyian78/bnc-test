"use client";

import axios from "axios";

export const apiUserClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_SERVER}/users`, // Replace with your actual base URL
  timeout: 9000, // Optional: Set a timeout for requests
  headers: {
    "Content-Type": "application/json", // Set default headers if needed
  },
});

export const apiTransactionClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_SERVER}/transactions`, // Replace with your actual base URL
  timeout: 9000, // Optional: Set a timeout for requests
  headers: {
    "Content-Type": "application/json", // Set default headers if needed
    Authorization:
      typeof window !== "undefined" ? sessionStorage.getItem("token") : "",
  },
});
