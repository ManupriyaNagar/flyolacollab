"use client";

import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';

const FleetSection = () => {
  const fleetData = [
    {
      type: "Super King Air B200",
      aircraft: [
        { regNo: "VT - RSN", msn: "BB-1631", seating: "02+08" }
      ]
    },
    {
      type: "King Air C90A",
      aircraft: [

        { regNo: "VT - JPK", msn: "LJ-1278", seating: "02+06" },
        { regNo: "VT - JIL", msn: "LJ-1573", seating: "02+06" },
        { regNo: "VT - EMJ", msn: "LJ-1137", seating: "02+06" }
      ]
    },
    {
      type: "Robinson R44 Raven II",
      aircraft: [
        { regNo: "VT - OJS", msn: "12473", seating: "01+03" },
        { regNo: "VT - ZJM", msn: "12210", seating: "01+03" },
        { regNo: "VT - HNC", msn: "11543", seating: "01+03" }
      ]
    },
    {
      type: "A109E Power Helicopter (Multi Engine)",
      aircraft: [
        { regNo: "VT-OSR", msn: "11745", seating: "02+06/01+07" },
        { regNo: "VT-OSN", msn: "11679", seating: "02+06/01+07" }
      ]
    }

  ];

  return (
    <section className={cn('py-24', 'px-4', 'sm:px-6', 'lg:px-8', 'relative', 'overflow-hidden , bg-blue-50')}>
      {/* Animated Background Elements */}


      <div className={cn('relative', 'z-10', 'max-w-7xl', 'mx-auto')}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={cn('text-center', 'mb-16')}
        >
          <div className={cn('flex', 'items-center', 'justify-center', 'gap-4', 'mb-6')}>
           
          </div>
          <h2 className={cn('text-5xl', 'md:text-6xl', 'font-bold', 'text-white', 'mb-6', 'leading-tight' ,'text-black')}>
            THE FLEET
          </h2>
          <p className={cn('text-xl', 'md:text-2xl', 'text-blue-600', 'mb-4', 'font-light')}>
            Aircraft Serve Aviation Pvt. Ltd. is having a fleet of
          </p>
          <p className={cn('text-3xl', 'md:text-4xl', 'font-bold', 'text-blue-800', 'mb-8')}>
            12 aircrafts all owned by JSAPL
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={cn('bg-white', 'rounded-sm',  'overflow-hidden', 'border', 'border-slate-200')}
        >
          {/* Table Header */}
          <div className={cn('bg-gradient-to-r', 'from-blue-600', 'to-blue-700', 'text-white')}>
            <div className={cn('grid', 'grid-cols-4', 'gap-4', 'p-6', 'font-bold', 'text-lg')}>
              <div className={cn('text-center')}>Type</div>
              <div className={cn('text-center')}>Regn. No.</div>
              <div className={cn('text-center')}>MSN</div>
              <div className={cn('text-center')}>Seating Capacity</div>
            </div>
          </div>

          {/* Table Body */}
          <div className={cn('divide-y', 'divide-slate-200')}>
            {fleetData.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                {category.aircraft.map((aircraft, aircraftIndex) => (
                  <motion.div
                    key={`${categoryIndex}-${aircraftIndex}`}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: (categoryIndex * category.aircraft.length + aircraftIndex) * 0.05 }}
                    className={cn('grid', 'grid-cols-4', 'gap-4', 'p-6', 'hover:bg-blue-50', 'transition-all', 'duration-300')}
                  >
                    <div className={cn('text-center', 'font-medium', 'text-slate-900')}>
                      {aircraftIndex === 0 ? (
                        <div className={cn('flex', 'flex-col', 'items-center', 'gap-2')}>
                          <span className={cn('text-sm', 'font-bold', 'text-blue-600')}>{category.type}</span>
                          {category.aircraft.length > 1 && (
                            <span className={cn('text-xs', 'text-slate-500', 'bg-slate-100', 'px-2', 'py-1', 'rounded-full')}>
                              {category.aircraft.length} units
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className={cn('text-slate-400', 'text-sm')}>〃</div>
                      )}
                    </div>
                    <div className={cn('text-center', 'font-mono', 'text-slate-700', 'font-medium')}>
                      {aircraft.regNo}
                    </div>
                    <div className={cn('text-center', 'font-mono', 'text-slate-700')}>
                      {aircraft.msn}
                    </div>
                    <div className={cn('text-center', 'font-bold', 'text-blue-600')}>
                      {aircraft.seating}
                    </div>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>


        {/* Fleet Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className={cn('mt-12', 'bg-gradient-to-r', 'from-blue-600', 'to-blue-700', 'rounded-3xl', 'p-8', 'text-white')}
        >
          <h3 className={cn('text-2xl', 'font-bold', 'mb-6', 'text-center')}>Fleet Highlights</h3>
          <div className={cn('grid', 'md:grid-cols-2', 'lg:grid-cols-4', 'gap-6')}>
            <div className={cn('text-center')}>
              <div className={cn('text-3xl', 'mb-2')}>🛩️</div>
              <p className={cn('font-semibold', 'mb-1')}>Private Aircrafts</p>
              <p className={cn('text-sm', 'text-blue-100')}>King Air & Super King Air</p>
            </div>
            <div className={cn('text-center')}>
              <div className={cn('text-3xl', 'mb-2')}>🚁</div>
              <p className={cn('font-semibold', 'mb-1')}>Helicopters</p>
              <p className={cn('text-sm', 'text-blue-100')}>Robinson R44 & Agusta A109E Power</p>
            </div>
            <div className={cn('text-center')}>
              <div className={cn('text-3xl', 'mb-2')}>✈️</div>
              <p className={cn('font-semibold', 'mb-1')}>Private Aircraft</p>
              <p className={cn('text-sm', 'text-blue-100')}>King Air C90A</p>
            </div>
            <div className={cn('text-center')}>
              <div className={cn('text-3xl', 'mb-2')}>🏆</div>
              <p className={cn('font-semibold', 'mb-1')}>DGCA Certified</p>
              <p className={cn('text-sm', 'text-blue-100')}>All aircraft compliant</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
};

export default FleetSection;