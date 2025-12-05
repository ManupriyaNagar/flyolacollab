"use client";

import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { cn } from "@/lib/utils";
import CalendarAndSlots from './../../components/Joyride/CalendarAndSlots';
import PassengerSelection from './../../components/Joyride/PassengerSelection';

export default function JoyrideBookingPage() {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [error, setError] = useState('');
  const [popup, setPopup] = useState({ show: false, message: '', isError: false });
  const { authState } = useAuth();
  const router = useRouter();

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setError('');
  };

  const showPopup = (message, isError = false) => {
    setPopup({ show: true, message, isError });
    setTimeout(() => setPopup({ show: false, message: '', isError: false }), 3000);
  };

  const handleBookingSubmit = async (data) => {
    if (!authState.isLoggedIn || !authState.user?.id) {
      setError('Please sign in to confirm your booking.');
      router.push('/sign-in');
      return;
    }

    setError('');
    try {
      console.log('Booking data:', {
        bookingId: data.bookingId,
        payment: data.payment,
        passengers: data.passengers,
      });

      showPopup(
        `🎉 Booking confirmed for ${data.passengers[0].name} and ${data.passengers.length} passenger(s) on ${selectedSlot.date} at ${selectedSlot.time} for ₹${data.totalPrice.toFixed(2)}`
      );

      const bookingData = {
        bookingId: data.bookingId,
        slot: {
          date: selectedSlot.date,
          time: selectedSlot.time,
        },
        passengers: data.passengers,
        total_price: data.totalPrice,
      };
      localStorage.setItem('recentBooking', JSON.stringify(bookingData));

      setSelectedSlot(null);
      setTimeout(() => router.push('/joy-ride-ticket'), 3000);
    } catch (err) {
      showPopup('An error occurred while confirming the booking', true);
    }
  };

  const experiences = [
    {
      title: "Scenic City Views",
      description: "Breathtaking aerial views of the cityscape and landmarks",
      icon: "🏙️",
      duration: "15-20 minutes"
    },
    {
      title: "Sunset Magic",
      description: "Golden hour flights with spectacular sunset views",
      icon: "🌅",
      duration: "20-25 minutes"
    },
    {
      title: "Photography Special",
      description: "Perfect angles for stunning aerial photography",
      icon: "📸",
      duration: "25-30 minutes"
    },
    {
      title: "Romantic Escape",
      description: "Intimate flights perfect for special occasions",
      icon: "💕",
      duration: "30-35 minutes"
    }
  ];

  const features = [
    {
      title: "Professional Pilots",
      description: "Experienced and certified pilots ensuring your safety",
      icon: "👨‍✈️"
    },
    {
      title: "Modern Fleet",
      description: "Well-maintained helicopters with latest safety features",
      icon: "🚁"
    },
    {
      title: "Flexible Timing",
      description: "Multiple slots available throughout the day",
      icon: "⏰"
    },
    {
      title: "Memorable Experience",
      description: "Create unforgettable memories in the sky",
      icon: "✨"
    }
  ];

  return (
    <div className={cn('min-h-screen', 'bg-gradient-to-br', 'from-sky-50', 'via-blue-50', 'to-indigo-100')}>
      
 {/* Hero Section */}
<div className={cn('relative', 'bg-white', 'text-gray-900', 'pt-20', 'overflow-hidden')}>

  <div className={cn('relative', 'max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8')}>
    <div className={cn('text-center')}>
      <div className={cn('inline-flex', 'items-center', 'gap-2', 'mb-6', 'px-4', 'py-2', 'bg-blue-50', 'rounded-full', 'border', 'border-blue-100')}>
        <span className="text-2xl">🚁</span>
        <span className={cn('text-sm', 'font-semibold', 'text-blue-900', 'uppercase', 'tracking-wider')}>Premium Aviation</span>
      </div>
      
      <h1 className={cn('text-5xl', 'md:text-6xl', 'lg:text-7xl', 'font-bold', 'mb-6', 'text-gray-900', 'tracking-tight')}>
        Sky High Joy Rides
      </h1>
      
      <p className={cn('text-lg', 'md:text-xl', 'mb-12', 'max-w-3xl', 'mx-auto', 'text-gray-600', 'leading-relaxed')}>
        Experience breathtaking aerial perspectives with our premium helicopter tours. 
        Professional pilots, state-of-the-art aircraft, and unforgettable memories await.
      </p>
    </div>
    

    
    {/* Stats Section */}
    
  </div>
</div>


      {/* Booking Section */}
      <section id="booking-section" className={cn('py-20', 'bg-white')}>
        <div className={cn('px-4', 'sm:px-6', 'lg:px-16')}>

          <div>
            {error && (
              <div className={cn('mb-6', 'p-4', 'bg-red-50', 'border', 'border-red-200', 'rounded-xl', 'text-red-700', 'text-center')}>
                <span className={cn('text-2xl', 'mr-2')}>⚠️</span>
                {error}
              </div>
            )}
            
            {selectedSlot ? (
              <div>
                <div className={cn('text-center', 'mb-8')}>
                  <h3 className={cn('text-2xl', 'font-bold', 'text-gray-900', 'mb-2')}>
                    🎉 Almost There! Complete Your Booking
                  </h3>
                  <div className={cn('bg-blue-600', 'text-white', 'px-6', 'py-3', 'rounded-full', 'inline-block')}>
                    {selectedSlot.date} at {selectedSlot.time}
                  </div>
                </div>
                <PassengerSelection
                  selectedSlot={selectedSlot}
                  onSubmit={handleBookingSubmit}
                  userId={authState.user?.id}
                  showPopup={showPopup}
                />
              </div>
            ) : (
              <div>
                <div className={cn('text-center', 'mb-8')}>
                 
                             
                </div>
                <CalendarAndSlots onSlotSelect={handleSlotSelect} />
              </div>
            )}
          </div>
        </div>
      </section>





      {/* <section id="experiences-section" className={cn('py-20', 'bg-white')}>
        <div className={cn('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8')}>
          <div className={cn('text-center', 'mb-16')}>
            <h2 className={cn('text-4xl', 'font-bold', 'text-gray-900', 'mb-4')}>
              Choose Your Sky Adventure 🌈
            </h2>
            <p className={cn('text-xl', 'text-gray-600', 'max-w-3xl', 'mx-auto')}>
              From romantic sunset flights to thrilling city tours, we have the perfect experience for every dreamer
            </p>
          </div>
          
          <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4', 'gap-8')}>
            {experiences.map((experience, index) => (
              <div key={index} className={cn('bg-gradient-to-br', 'from-blue-50', 'to-indigo-50', 'rounded-2xl', 'p-6', 'hover:shadow-xl', 'transition-all', 'duration-300', 'transform', 'hover:-translate-y-2', 'border', 'border-blue-100')}>
                <div className={cn('text-center', 'mb-4')}>
                  <div className={cn('text-4xl', 'mb-3')}>{experience.icon}</div>
                  <h3 className={cn('text-xl', 'font-bold', 'text-gray-900', 'mb-2')}>{experience.title}</h3>
                  <div className={cn('bg-blue-600', 'text-white', 'px-3', 'py-1', 'rounded-full', 'text-sm', 'font-medium')}>
                    {experience.duration}
                  </div>
                </div>
                <p className={cn('text-gray-600', 'text-center')}>{experience.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

 */}

      {/* Features Section */}
      <section className={cn('py-20', 'bg-gradient-to-br', 'from-indigo-50', 'to-purple-50')}>
        <div className={cn('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8')}>
          <div className={cn('text-center', 'mb-16')}>
            <h2 className={cn('text-4xl', 'font-bold', 'text-gray-900', 'mb-4')}>
              Why Choose Flyola Joy Rides? 🎯
            </h2>
            <p className={cn('text-xl', 'text-gray-600', 'max-w-3xl', 'mx-auto')}>
              We're committed to making your sky adventure safe, memorable, and absolutely magical
            </p>
          </div>
          
          <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4', 'gap-8')}>
            {features.map((feature, index) => (
              <div key={index} className={cn('bg-white', 'rounded-2xl', 'p-6', 'text-center', 'hover:shadow-xl', 'transition-all', 'duration-300', 'transform', 'hover:-translate-y-2')}>
                <div className={cn('text-4xl', 'mb-4')}>{feature.icon}</div>
                <h3 className={cn('text-xl', 'font-bold', 'text-gray-900', 'mb-3')}>{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Important Information */}
      <section className={cn('py-16', 'bg-gradient-to-r', 'from-blue-600', 'to-indigo-700', 'text-white')}>
        <div className={cn('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8')}>
          <div className={cn('text-center', 'mb-12')}>
            <h2 className={cn('text-3xl', 'font-bold', 'mb-4')}>📋 Important Flight Information</h2>
          </div>
          
          <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-3', 'gap-8')}>
            <div className={cn('bg-white/10', 'backdrop-blur-sm', 'rounded-2xl', 'p-6', 'text-center')}>
              <div className={cn('text-3xl', 'mb-4')}>⏰</div>
              <h3 className={cn('text-xl', 'font-bold', 'mb-3')}>Flight Schedule</h3>
              <p className="text-blue-100">
                Flights operate between 4:00 PM and 6:00 PM daily. 
                Please arrive 15 minutes before your scheduled time.
              </p>
            </div>
            
            <div className={cn('bg-white/10', 'backdrop-blur-sm', 'rounded-2xl', 'p-6', 'text-center')}>
              <div className={cn('text-3xl', 'mb-4')}>🎫</div>
              <h3 className={cn('text-xl', 'font-bold', 'mb-3')}>Booking Policy</h3>
              <p className="text-blue-100">
                Easy rescheduling and refund options available. 
                Contact our support team for any changes.
              </p>
            </div>
            
            <div className={cn('bg-white/10', 'backdrop-blur-sm', 'rounded-2xl', 'p-6', 'text-center')}>
              <div className={cn('text-3xl', 'mb-4')}>🌟</div>
              <h3 className={cn('text-xl', 'font-bold', 'mb-3')}>Special Partnership</h3>
              <p className="text-blue-100">
                Proudly partnered with Delhi NCR influencers! 
                Share your experience and get special discounts.
              </p>
            </div>
          </div>
          
          <div className={cn('text-center', 'mt-12')}>
            <div className={cn('bg-white/10', 'backdrop-blur-sm', 'rounded-2xl', 'p-6', 'inline-block')}>
              <h3 className={cn('text-xl', 'font-bold', 'mb-3')}>📞 Need Help?</h3>
              <p className={cn('text-blue-100', 'mb-4')}>Our friendly team is here to assist you!</p>
              <div className={cn('flex', 'flex-col', 'sm:flex-row', 'gap-4', 'justify-center')}>
                <a href="tel:+919311896389" className={cn('bg-white', 'text-blue-600', 'px-6', 'py-3', 'rounded-full', 'font-semibold', 'hover:bg-blue-50', 'transition-colors', 'duration-200')}>
                  📱 +91 9311896389
                </a>
                <a href="tel:+919202961237" className={cn('bg-white', 'text-blue-600', 'px-6', 'py-3', 'rounded-full', 'font-semibold', 'hover:bg-blue-50', 'transition-colors', 'duration-200')}>
                  📱 +91 9202961237
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

  

      {/* Success/Error Popup */}
      {popup.show && (
        <div className={cn('fixed', 'inset-0', 'flex', 'items-center', 'justify-center', 'z-50', 'bg-black/50', 'backdrop-blur-sm')}>
          <div
            className={`p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 text-center transform transition-all duration-300 ${
              popup.isError 
                ? 'bg-gradient-to-br from-red-500 to-red-600 text-white' 
                : 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
            }`}
          >
            <div className={cn('text-4xl', 'mb-4')}>
              {popup.isError ? '😞' : '🎉'}
            </div>
            <p className={cn('text-lg', 'font-medium')}>{popup.message}</p>
            {!popup.isError && (
              <div className={cn('mt-4', 'text-sm', 'opacity-90')}>
                Redirecting to your ticket...
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}