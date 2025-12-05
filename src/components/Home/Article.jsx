"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaNewspaper, FaClock, FaArrowRight, FaCalendarAlt } from "react-icons/fa";
import { cn } from "@/lib/utils";

const ArticleSection = () => {
  const articles = [
    {
      image: "/1.png",
      category: "Travel Tips",
      title: "Seamless Travel Starts Here: Why Flyola Is Your Go-To Flight Booking Platform",
      description: "Traveling can often be a stressful experience, from finding the right flight to managing reservations and navigating airport procedures. Discover how Flyola simplifies your journey.",
      link: "#",
      readTime: "5 min read",
      date: "Dec 15, 2024",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      image: "/2.png",
      category: "Quick Booking",
      title: "How Flyola Makes Last-Minute Travel Plans Easy and Affordable",
      description: "Sometimes, travel plans change unexpectedly, and finding a last-minute flight can be challenging. At Flyola, we understand the urgency and provide instant solutions.",
      link: "#",
      readTime: "4 min read",
      date: "Dec 12, 2024",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      image: "/3.png",
      category: "Customer Stories",
      title: "The Flyola Advantage: Why Our Customers Love Us",
      description: "At Flyola, we believe that the best way to build lasting relationships with our customers is by delivering exceptional service and unforgettable experiences.",
      link: "#",
      readTime: "6 min read",
      date: "Dec 10, 2024",
      gradient: "from-purple-500 to-pink-600"
    }
  ];

  return (
    <section className={cn('py-16', 'lg:py-24', 'bg-gradient-to-br', 'from-gray-50', 'via-white', 'to-indigo-50', 'relative', 'overflow-hidden')}>
      {/* Background Pattern */}
      <div className={cn('absolute', 'inset-0', 'opacity-5')}>
        <div className={cn('absolute', 'top-20', 'left-20', 'w-32', 'h-32', 'border', 'border-blue-300', 'rounded-full')}></div>
        <div className={cn('absolute', 'bottom-20', 'right-20', 'w-40', 'h-40', 'border', 'border-indigo-300', 'rounded-full')}></div>
        <div className={cn('absolute', 'top-1/2', 'left-1/4', 'w-24', 'h-24', 'border', 'border-purple-300', 'rounded-full')}></div>
      </div>

      <div className={cn('px-4', 'sm:px-6', 'lg:px-8', 'relative', 'z-10')}>
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={cn('text-center', 'mb-16')}
        >
          <div className={cn('inline-flex', 'items-center', 'gap-2', 'bg-gradient-to-r', 'from-orange-100', 'to-red-100', 'text-orange-800', 'px-6', 'py-2', 'text-sm', 'font-bold', 'rounded-full', 'shadow-sm', 'mb-6')}>
            <FaNewspaper className="text-orange-600" />
            Latest Articles
          </div>

          <h2 className={cn('text-3xl', 'sm:text-4xl', 'lg:text-5xl', 'font-bold', 'text-gray-900', 'mb-6', 'leading-tight')}>
            Trending &
            <span className={cn('bg-gradient-to-r', 'from-blue-600', 'to-indigo-600', 'bg-clip-text', 'text-transparent')}> Popular Articles</span>
          </h2>

          <p className={cn('text-lg', 'text-gray-600', 'max-w-4xl', 'mx-auto', 'leading-relaxed')}>
            Our management is at the forefront, enabling the team to overcome any hurdles in offering clients
            hassle-free private air charter solutions. Stay updated with our latest insights and travel tips.
          </p>
        </motion.div>

        {/* Articles Grid */}
        <div className={cn('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-8')}>
          {articles.map((article, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className={cn('group', 'bg-white', 'rounded-3xl', 'shadow-lg', 'hover:shadow-2xl', 'overflow-hidden', 'border', 'border-gray-100', 'transition-all', 'duration-500')}
            >
              {/* Image Container */}
              <div className={cn('relative', 'overflow-hidden')}>
                <img
                  src={article.image}
                  alt={article.title}
                  className={cn('w-full', 'h-64', 'object-cover', 'group-hover:scale-110', 'transition-transform', 'duration-700')}
                />

                {/* Overlay */}
                <div className={cn('absolute', 'inset-0', 'bg-gradient-to-t', 'from-black/50', 'via-transparent', 'to-transparent', 'opacity-0', 'group-hover:opacity-100', 'transition-opacity', 'duration-300')}></div>

                {/* Category Badge */}
                <div className={cn('absolute', 'top-4', 'left-4')}>
                  <span className={`text-xs font-bold text-white bg-gradient-to-r ${article.gradient} px-4 py-2 rounded-full shadow-lg`}>
                    {article.category}
                  </span>
                </div>

                {/* Read Time Badge */}
                <div className={cn('absolute', 'top-4', 'right-4', 'bg-white/90', 'backdrop-blur-sm', 'rounded-full', 'px-3', 'py-1', 'flex', 'items-center', 'gap-1')}>
                  <FaClock className={cn('text-gray-600', 'text-xs')} />
                  <span className={cn('text-xs', 'font-semibold', 'text-gray-800')}>{article.readTime}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Date */}
                <div className={cn('flex', 'items-center', 'gap-2', 'mb-3')}>
                  <FaCalendarAlt className={cn('text-gray-400', 'text-sm')} />
                  <span className={cn('text-sm', 'text-gray-500')}>{article.date}</span>
                </div>

                {/* Title */}
                <h3 className={cn('text-xl', 'font-bold', 'text-gray-900', 'mb-3', 'leading-tight', 'group-hover:text-blue-600', 'transition-colors', 'duration-300', 'line-clamp-2')}>
                  {article.title}
                </h3>

                {/* Description */}
                <p className={cn('text-gray-600', 'text-sm', 'leading-relaxed', 'mb-4', 'line-clamp-3')}>
                  {article.description}
                </p>

                {/* Read More Link */}
                <div className={cn('flex', 'items-center', 'justify-between')}>
                  <a
                    href={article.link}
                    className={`inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${article.gradient} bg-clip-text text-transparent hover:gap-3 transition-all duration-300 group/link`}
                  >
                    Read More
                    <FaArrowRight className={cn('text-xs', 'group-hover/link:translate-x-1', 'transition-transform', 'duration-300')} />
                  </a>

                  {/* Share Button */}
                  <button className={cn('w-8', 'h-8', 'bg-gray-100', 'rounded-full', 'flex', 'items-center', 'justify-center', 'hover:bg-gray-200', 'transition-colors', 'duration-300', 'group-hover:scale-110')}>
                    <span className={cn('text-gray-600', 'text-xs')}>↗</span>
                  </button>
                </div>
              </div>

              {/* Hover Border Effect */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${article.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`}></div>
            </motion.article>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={cn('text-center', 'mt-16')}
        >
          <div className={cn('bg-gradient-to-r', 'from-blue-600', 'to-indigo-600', 'rounded-3xl', 'p-8', 'text-white', 'shadow-2xl')}>
            <h3 className={cn('text-2xl', 'font-bold', 'mb-4')}>Want to Stay Updated?</h3>
            <p className={cn('text-blue-100', 'mb-6', 'max-w-2xl', 'mx-auto')}>
              Subscribe to our newsletter and never miss the latest travel tips, industry insights, and exclusive offers
            </p>
            <div className={cn('flex', 'flex-col', 'sm:flex-row', 'gap-4', 'justify-center', 'items-center', 'max-w-md', 'mx-auto')}>
              <input
                type="email"
                placeholder="Enter your email"
                className={cn('flex-1', 'px-4', 'py-3', 'border-white', 'border-2', 'text-white', 'rounded-xl', 'text-gray-900', 'placeholder-gray-50', 'focus:outline-none', 'focus:ring-2', 'focus:ring-white/50')}
              />
              <button className={cn('bg-white', 'text-blue-600', 'px-6', 'py-3', 'rounded-xl', 'font-bold', 'hover:bg-gray-100', 'transform', 'hover:scale-105', 'transition-all', 'duration-300', 'shadow-lg', 'whitespace-nowrap')}>
                Subscribe Now
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ArticleSection;
