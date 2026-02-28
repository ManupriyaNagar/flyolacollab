export default function FlightHeader() {
  return (
    <div className="w-full bg-gray-100 px-6 md:px-20 py-8">
      <div className="container mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-8">
        
        {/* Left Section */}
        <div>
          <h1 className="text-3xl md:text-xl font-light text-neutral-500">
            Flight from{" "}
            <span className="font-semibold text-black">Bhopal</span>{" "}
            to{" "}
            <span className="font-semibold text-black">Indor</span>
          </h1>

          <p className="mt-3 text-neutral-400 text-sm">
            The price is average for one person. Included all taxes and fees.
          </p>
        </div>
        {/* Right Section */}
        <div className="text-neutral-500 text-lg md:text-sm">
          Showing 1-10 of 100 results
        </div>
      </div>
    </div>
  );
}