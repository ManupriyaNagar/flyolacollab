export default function FlightHeader({
  departure = "Bhopal",
  arrival = "Indore",
  totalResults = 0
}) {
  return (
    <div className="w-full bg-gray-100 md:px-20 py-2">
      <div className="container mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-8">

        {/* Left Section */}
        <div>
          <h1 className="lg:text-3xl md:text-xl text-lg font-light text-neutral-500">
            Flight from{" "}
            <span className="font-semibold text-black">{departure || "Bhopal"}</span>{" "}
            to{" "}
            <span className="font-semibold text-black">{arrival || "Indore"}</span>
          </h1>

          <p className="mt-3 text-neutral-400 md:text-sm text-md">
            The price is average for one person. Included all taxes and fees.
          </p>
        </div>
        {/* Right Section */}
        <div className="text-neutral-500 text-lg md:text-sm">
          Showing 1-{Math.min(totalResults, 10)} of {totalResults} results
        </div>
      </div>
    </div>
  );
}