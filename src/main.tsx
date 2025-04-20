import React from 'react'
import { createRoot } from 'react-dom/client'
import { Router } from './router/Router'
import { useQuery } from '@tanstack/react-query';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from 'react-toastify';
import { Layout } from './components/Layout'
import './App.css'

const queryClient = new QueryClient();

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <Layout>
    <ToastContainer position="top-right" autoClose={2500} />
        <Router />
    </Layout>
    </QueryClientProvider>
  </React.StrictMode>
)
