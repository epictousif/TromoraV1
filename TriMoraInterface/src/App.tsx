"use client"

import "./index.css"
import { Routes, Route, useLocation } from "react-router-dom"
import { Suspense, lazy } from "react"
import Navbar from "./_components/navbar"
import Cityfilter from "./_components/city-filter"
import Search from "./_components/Search"
import About from "./_components/about"
import Footer from "./_components/footer"


// Lazy loaded components
const Booking = lazy(() => import("./pages/booking"))
const Viewdetails = lazy(() => import("./pages/view-details"))





function LayoutWrapper() {
  const location = useLocation()

  // Hide layout on dashboard routes
  const hideLayoutPaths = ["/saloonUserdashboard"]
  const shouldHideLayout = hideLayoutPaths.some(path =>
    location.pathname.startsWith(path)
  )

  return (
    <>
      {!shouldHideLayout && <Navbar />}

      <Routes>
        {/* Landing/Home Page */}
        <Route
          path="/"
          element={
            <>
              <Cityfilter />
              <Search />
              <About />
            </>
          }
        />

        {/* Booking Page */}
        <Route
          path="/booking"
          element={
            <Suspense fallback={<div>Loading Booking Page...</div>}>
              <Booking />
            </Suspense>
          }
        />

        {/* Salon Details Page */}
        <Route
          path="/salon/:id"
          element={
            <Suspense fallback={<div>Loading Details...</div>}>
              <Viewdetails />
            </Suspense>
          }
        />

        {/* Login Page */}
      
       

      
     
      </Routes>

      {!shouldHideLayout && <Footer />}
    </>
  )
}

export default function AppRoutes() {
  return <LayoutWrapper />
}
