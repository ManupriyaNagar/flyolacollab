"use client";

import { cn } from "@/lib/utils";




const RefundPolicyPage = () => {
  return (
    <div className={cn('min-h-screen', 'bg-gray-50')}>

      
      <div className={cn('px-4', 'sm:px-6', 'lg:px-8', 'py-16')}>
        <div className={cn('bg-white', 'rounded-lg', 'shadow-lg', 'p-8')}>
          <h1 className={cn('text-4xl', 'font-bold', 'text-gray-900', 'mb-8', 'text-center')}>Refund Policy</h1>
          
          <div className={cn('prose', 'max-w-none')}>
            <p className={cn('text-gray-600', 'mb-8', 'text-center')}>
              <strong>For Confirmed Tickets</strong>
            </p>

            <section className="mb-8">
              <h2 className={cn('text-2xl', 'font-bold', 'text-gray-900', 'mb-6')}>Cancellation Policy</h2>
              
              <div className="space-y-6">
                <div className={cn('border-l-4', 'border-green-500', 'pl-6', 'py-4', 'bg-green-50', 'rounded-r-lg')}>
                  <h3 className={cn('text-xl', 'font-semibold', 'text-gray-900', 'mb-3')}>1. Cancellation more than 96 hours prior to departure</h3>
                  <ul className={cn('list-disc', 'pl-6', 'text-gray-600', 'space-y-2')}>
                    <li>A flat cancellation fee of <strong>INR 400/-</strong> per seat will be deducted.</li>
                    <li>The remaining amount will be refunded to the original mode of payment.</li>
                  </ul>
                </div>

                <div className={cn('border-l-4', 'border-yellow-500', 'pl-6', 'py-4', 'bg-yellow-50', 'rounded-r-lg')}>
                  <h3 className={cn('text-xl', 'font-semibold', 'text-gray-900', 'mb-3')}>2. Cancellation between 48 to 96 hours prior to departure</h3>
                  <ul className={cn('list-disc', 'pl-6', 'text-gray-600', 'space-y-2')}>
                    <li><strong>25%</strong> of the total booking amount will be deducted as cancellation charges.</li>
                    <li>The balance amount will be refunded.</li>
                  </ul>
                </div>

                <div className={cn('border-l-4', 'border-orange-500', 'pl-6', 'py-4', 'bg-orange-50', 'rounded-r-lg')}>
                  <h3 className={cn('text-xl', 'font-semibold', 'text-gray-900', 'mb-3')}>3. Cancellation between 24 to 48 hours prior to departure</h3>
                  <ul className={cn('list-disc', 'pl-6', 'text-gray-600', 'space-y-2')}>
                    <li><strong>50%</strong> of the total booking amount will be deducted as cancellation charges.</li>
                    <li>The balance amount will be refunded.</li>
                  </ul>
                </div>

                <div className={cn('border-l-4', 'border-red-500', 'pl-6', 'py-4', 'bg-red-50', 'rounded-r-lg')}>
                  <h3 className={cn('text-xl', 'font-semibold', 'text-gray-900', 'mb-3')}>4. Cancellation less than 24 hours prior to departure</h3>
                  <ul className={cn('list-disc', 'pl-6', 'text-gray-600', 'space-y-2')}>
                    <li><strong>No refund</strong> shall be applicable.</li>
                  </ul>
                </div>
              </div>

              <div className={cn('mt-6', 'p-4', 'bg-blue-50', 'border', 'border-blue-200', 'rounded-lg')}>
                <p className="text-blue-800">
                  <strong>Note:</strong> All refunds will be processed within <strong>7–10 business days</strong> from the date of cancellation.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className={cn('text-2xl', 'font-bold', 'text-gray-900', 'mb-6')}>Rescheduling Policy</h2>
              <p className={cn('text-gray-600', 'mb-6')}>
                We offer flexibility to reschedule your travel in case of changes in your plan. The following conditions apply:
              </p>
              
              <div className="space-y-6">
                <div className={cn('border-l-4', 'border-green-500', 'pl-6', 'py-4', 'bg-green-50', 'rounded-r-lg')}>
                  <h3 className={cn('text-xl', 'font-semibold', 'text-gray-900', 'mb-3')}>1. Rescheduling more than 48 hours prior to departure</h3>
                  <ul className={cn('list-disc', 'pl-6', 'text-gray-600', 'space-y-2')}>
                    <li>Permitted with <strong>INR 500</strong> rescheduling fee.</li>
                    <li>Fare difference, if any, will be applicable.</li>
                  </ul>
                </div>

                <div className={cn('border-l-4', 'border-yellow-500', 'pl-6', 'py-4', 'bg-yellow-50', 'rounded-r-lg')}>
                  <h3 className={cn('text-xl', 'font-semibold', 'text-gray-900', 'mb-3')}>2. Rescheduling between 24 to 48 hours prior to departure</h3>
                  <ul className={cn('list-disc', 'pl-6', 'text-gray-600', 'space-y-2')}>
                    <li>Rescheduling fee of <strong>INR 1000/-</strong> per seat will be charged.</li>
                    <li>Fare difference, if any, will also apply.</li>
                  </ul>
                </div>

                <div className={cn('border-l-4', 'border-red-500', 'pl-6', 'py-4', 'bg-red-50', 'rounded-r-lg')}>
                  <h3 className={cn('text-xl', 'font-semibold', 'text-gray-900', 'mb-3')}>3. Rescheduling less than 24 hours prior to departure</h3>
                  <ul className={cn('list-disc', 'pl-6', 'text-gray-600', 'space-y-2')}>
                    <li><strong>Rescheduling not permitted.</strong></li>
                    <li>Passengers are advised to cancel the ticket as per the refund policy if needed.</li>
                  </ul>
                </div>
              </div>

              <div className={cn('mt-6', 'p-4', 'bg-blue-50', 'border', 'border-blue-200', 'rounded-lg')}>
                <p className={cn('text-blue-800', 'mb-2')}>
                  <strong>Note:</strong> Rescheduling is subject to seat availability on the desired flight/date.
                </p>
                <p className="text-blue-800">
                  <strong>Important:</strong> Rescheduled bookings are non-refundable.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className={cn('text-2xl', 'font-bold', 'text-gray-900', 'mb-6')}>Helicopter Ticket Policy</h2>
              
              <div className="space-y-6">
                <div className={cn('border-l-4', 'border-purple-500', 'pl-6', 'py-4', 'bg-purple-50', 'rounded-r-lg')}>
                  <h3 className={cn('text-xl', 'font-semibold', 'text-gray-900', 'mb-3')}>Baggage & Weight Policy</h3>
                  <ul className={cn('list-disc', 'pl-6', 'text-gray-600', 'space-y-2')}>
                    <li><strong>Important:</strong> Only faulty weight/baggage found at boarding will result in deboarding.</li>
                    <li>Passengers must declare accurate weight and baggage information during booking.</li>
                    <li>Excess baggage charges apply as per helicopter operator policy.</li>
                    <li>Safety regulations require strict adherence to weight limits.</li>
                  </ul>
                </div>

                <div className={cn('border-l-4', 'border-pink-500', 'pl-6', 'py-4', 'bg-pink-50', 'rounded-r-lg')}>
                  <h3 className={cn('text-xl', 'font-semibold', 'text-gray-900', 'mb-3')}>Infant & Child Policy</h3>
                  <ul className={cn('list-disc', 'pl-6', 'text-gray-600', 'space-y-2')}>
                    <li><strong>Infants (below 6 months & 8kg):</strong> No ticket required.</li>
                    <li><strong>Infants  (6 months and above):</strong> Full ticket required at base fare of <strong>₹1,000</strong>.</li>
                    <li><strong>Mandatory:</strong> Child's Date of Birth (DOB) must be provided during booking.</li>
                    <li>Infants must be accompanied by an adult passenger.</li>
                  </ul>
                </div>
              </div>

              <div className={cn('mt-6', 'p-4', 'bg-yellow-50', 'border', 'border-yellow-300', 'rounded-lg')}>
                <p className="text-yellow-900">
                  <strong>⚠️ Important Notice:</strong> Helicopter operations are subject to weather conditions and operational clearances. 
                  In case of flight cancellation due to weather or technical reasons, full refund will be provided or alternative arrangements will be made.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className={cn('text-2xl', 'font-bold', 'text-gray-900', 'mb-4')}>How to Cancel or Reschedule</h2>
              <div className={cn('bg-gray-50', 'p-6', 'rounded-lg')}>
                <p className={cn('text-gray-600', 'mb-4')}>
                  To cancel or reschedule your booking, please contact us through any of the following methods:
                </p>
                <div className={cn('space-y-2', 'text-gray-600')}>
                  <p><strong>Phone:</strong> +91 9311896389, +91 9202961237</p>
                  <p><strong>Email:</strong> support@flyola.com</p>
                  <p><strong>Website:</strong> Visit our customer portal</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className={cn('text-2xl', 'font-bold', 'text-gray-900', 'mb-4')}>Contact Information</h2>
              <p className={cn('text-gray-600', 'mb-4')}>
                For any questions regarding our refund policy or to process a cancellation/rescheduling request, please contact:
              </p>
              <div className={cn('bg-blue-50', 'p-6', 'rounded-lg')}>
                <p className={cn('text-gray-800', 'font-semibold', 'mb-2')}>Jet Serve Aviation Pvt. Ltd.</p>
                <p className="text-gray-600"><strong>For booking Call us:</strong></p>
                <p className="text-gray-600"><strong>Phone:</strong> +91 9311896389, +91 9202961237</p>
                <p className="text-gray-600"><strong>Email:</strong> info@flyola.com</p>
              </div>
            </section>
          </div>
        </div>
      </div>


    </div>
  );
};

export default RefundPolicyPage;