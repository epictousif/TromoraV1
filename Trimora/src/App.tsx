import "./index.css"
import { Routes, Route, useLocation } from "react-router"
import { Suspense, lazy, useEffect } from "react"
import { ThemeProvider } from "./SalonFinder/components/theme-provider"
import SplashCursor from "./SalonFinder/components/ui/splash-cursor"
import { AuthProvider } from "./context/AuthContext"

// Lazy-loaded components
const Navbar = lazy(() => import("./_components/navbar"))
const About = lazy(() => import("./_components/about"))
const HowItWorks = lazy(() => import("./_components/how-it-works"))
const Careers = lazy(() => import("./_components/careers"))
const Footer = lazy(() => import("./_components/footer-simple").then(m => ({ default: m.TrimoraFooter })))
const Auth = lazy(() => import("./_components/auth"))
const PartnerWithUs = lazy(() => import("./_components/partner-with-us"))
const MyAccount = lazy(() => import("./_components/my-account"))
const MyBookings = lazy(() => import("./_components/my-bookings"))
const Help = lazy(() => import("./_components/help"))
const PressMedia = lazy(() => import("./_components/press-media"))
const Blog = lazy(() => import("./_components/blog"))
const ContactUs = lazy(() => import("./_components/contact-us"))
const FAQ = lazy(() => import("./_components/faq"))
const PrivacyPolicy = lazy(() => import("./_components/privacy-policy"))
const TermsConditions = lazy(() => import("./_components/terms-conditions"))
const RefundPolicy = lazy(() => import("./_components/refund-policy"))
const CookiePolicy = lazy(() => import("./_components/cookie-policy"))
const Disclaimer = lazy(() => import("./_components/disclaimer"))
const BookingSupport = lazy(() => import("./_components/booking-support"))
const PartnerSupport = lazy(() => import("./_components/partner-support"))
// SalonFinder is a named export; map it to a default export for React.lazy
const SalonFinder = lazy(() =>
  import("@/SalonFinder/components/salon-finder").then((m) => ({ default: m.SalonFinder }))
)
const SalonDetails = lazy(() =>
  import("@/SalonFinder/components/salon-details").then((m) => ({ default: m.SalonDetails }))
)
const BookingCheckout = lazy(() =>
  import("@/SalonFinder/components/booking-checkout").then((m) => ({ default: m.BookingCheckout }))
)
const BookingPage = lazy(() => import("./components/booking/BookingPage"))
const BookingDemo = lazy(() => import("./components/booking/BookingDemo"))
const ServiceSelectionPage = lazy(() =>
  import("@/SalonFinder/components/ServiceSelectionPage").then((m) => ({ default: m.ServiceSelectionPage }))
)

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    // Defer to next frame to avoid any layout/restore overriding
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    })
  }, [pathname])
  return null
}

function LayoutWrapper() {
  const location = useLocation()
  const hideNavbar =
    location.pathname.startsWith("/auth") ||
    location.pathname.startsWith("/partner-with-us")
  const brandOnlyNavbar = location.pathname.startsWith("/checkout")
  const hideFooter = location.pathname.startsWith("/partner-with-us") || location.pathname.startsWith("/auth")
  useEffect(() => {
    const prev = (window.history as any).scrollRestoration
    try { (window.history as any).scrollRestoration = 'manual' } catch {}
    return () => {
      try { (window.history as any).scrollRestoration = prev ?? 'auto' } catch {}
    }
  }, [])
  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {/* Global cursor animation */}
        <SplashCursor />
        <ScrollToTop />
        <Suspense fallback={<div>Loading...</div>}>
          {!hideNavbar && <Navbar brandOnly={brandOnlyNavbar} />}

          <Routes>
          {/* Landing/Home Page */}
          <Route
            path="/"
            element={
              <>
                <SalonFinder />
              </>
            }
          />

          {/* About Us page */}
          <Route path="/about" element={<About />} />

          {/* How It Works page */}
          <Route path="/how-it-works" element={<HowItWorks />} />

          {/* Careers page */}
          <Route path="/careers" element={<Careers />} />

          {/* Salon details page */}
          <Route path="/salon/:id" element={<SalonDetails />} />

          {/* Auth page */}
          <Route path="/auth" element={<Auth />} />

          {/* Partner with us */}
          <Route path="/partner-with-us" element={<PartnerWithUs />} />

          {/* Customer pages */}
          <Route path="/account" element={<MyAccount />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/checkout" element={<BookingCheckout />} />

          {/* Help page */}
          <Route path="/help" element={<Help />} />

          {/* Press & Media page */}
          <Route path="/press-media" element={<PressMedia />} />

          {/* Blog page */}
          <Route path="/blog" element={<Blog />} />

          {/* Contact Us page */}
          <Route path="/contact" element={<ContactUs />} />

          {/* FAQ page */}
          <Route path="/faq" element={<FAQ />} />

          {/* Privacy Policy page */}
          <Route path="/privacy" element={<PrivacyPolicy />} />

          {/* Terms & Conditions page */}
          <Route path="/terms" element={<TermsConditions />} />

          {/* Refund Policy page */}
          <Route path="/refund" element={<RefundPolicy />} />

          {/* Cookie Policy page */}
          <Route path="/cookies" element={<CookiePolicy />} />

          {/* Disclaimer page */}
          <Route path="/disclaimer" element={<Disclaimer />} />

          {/* Booking Support page */}
          <Route path="/booking-support" element={<BookingSupport />} />

          {/* Partner Support page */}
          <Route path="/partner-support" element={<PartnerSupport />} />

          {/* Fresha-style booking flow */}
          <Route path="/book/:salonId" element={<BookingPage />} />
          <Route path="/booking-demo" element={<BookingDemo />} />
          <Route path="/services/:salonId" element={<ServiceSelectionPage />} />

        </Routes>

          {!hideFooter && <Footer />}
        </Suspense>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default function AppRoutes() {
  return <LayoutWrapper />
}
