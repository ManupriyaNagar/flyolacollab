import { httpClient } from '../baseApi';

export class AirportService {
    // Cache for airport data to avoid repeated API calls
    static airportCache = new Map();
    static cacheExpiry = 5 * 60 * 1000; // 5 minutes cache
    static lastFetchTime = 0;

    static async getAirports() {
        const now = Date.now();
        
        // Return cached data if still valid
        if (this.airportCache.size > 0 && (now - this.lastFetchTime) < this.cacheExpiry) {
            return Array.from(this.airportCache.values());
        }

        try {
            const response = await httpClient.get('/airport');
            const airports = response.data;
            
            if (Array.isArray(airports)) {
                // Update cache
                this.airportCache.clear();
                airports.forEach(airport => {
                    this.airportCache.set(airport.id, airport);
                });
                this.lastFetchTime = now;
                
                return airports;
            }
            
            return [];
        } catch (error) {
            console.log('Airport API error:', error.message);
            
            // If we have cached data, use it even if expired
            if (this.airportCache.size > 0) {
                console.log('Using cached airport data');
                return Array.from(this.airportCache.values());
            }
            
            // Return fallback airport data if API fails completely
            console.log('Using fallback airport data');
            return [
                { id: 1, city: "BHOPAL", airport_code: "BHO", airport_name: "Raja Bhoj Airport", status: 1 },
                { id: 2, city: "JABALPUR", airport_code: "JLR", airport_name: "Jabalpur Airport", status: 1 },
                { id: 3, city: "KHAJURAHO", airport_code: "HJR", airport_name: "Khajuraho Airport", status: 1 },
                { id: 5, city: "INDORE", airport_code: "IDR", airport_name: "Devi Ahilya Bai Holkar Airport", status: 1 },
                { id: 6, city: "SINGRAULI", airport_code: "SGR", airport_name: "Singrauli Airport", status: 1 },
                { id: 7, city: "REWA", airport_code: "REW", airport_name: "Rewa Airport", status: 1 }
            ];
        }
    }

    static async getAirportById(id) {
        // Try cache first
        const cachedAirport = this.airportCache.get(parseInt(id));
        if (cachedAirport) {
            return cachedAirport;
        }

        try {
            const response = await httpClient.get(`/airport/${id}`);
            const airport = response.data;
            
            // Update cache
            if (airport?.id) {
                this.airportCache.set(airport.id, airport);
            }
            
            return airport;
        } catch (error) {
            throw error;
        }
    }

    static async searchAirports(query) {
        const response = await httpClient.get('/airport/search', { q: query });
        return response.data;
    }

    // Get airport from cache
    static getAirportFromCache(airportId) {
        return this.airportCache.get(parseInt(airportId));
    }

    // Get airport name by ID (from cache or API)
    static async getAirportName(airportId) {
        const airport = this.getAirportFromCache(airportId);
        if (airport) {
            return airport.airport_name;
        }

        try {
            const airportData = await this.getAirportById(airportId);
            return airportData?.airport_name || null;
        } catch (error) {
            return null;
        }
    }

    // Get airport code by ID (from cache or API)
    static async getAirportCode(airportId) {
        const airport = this.getAirportFromCache(airportId);
        if (airport) {
            return airport.airport_code;
        }

        try {
            const airportData = await this.getAirportById(airportId);
            return airportData?.airport_code || null;
        } catch (error) {
            return null;
        }
    }

    // Build airport map from array for quick lookup
    static buildAirportMap(airports) {
        const map = {};
        
        // Build map from provided airports array
        if (Array.isArray(airports)) {
            airports.forEach(airport => {
                if (airport?.id) {
                    map[airport.id] = airport;
                }
            });
        }
        
        // Also add any cached airports that might not be in the provided array
        this.airportCache.forEach((airport, id) => {
            if (!map[id]) {
                map[id] = airport;
            }
        });
        
        return map;
    }

    // Resolve airport name with fallback logic
    static resolveAirportName(airportId, airportMap = {}) {
        // Try from provided map first
        if (airportMap[airportId]?.airport_name) {
            return airportMap[airportId].airport_name;
        }
        
        // Try from cache
        const airport = this.getAirportFromCache(airportId);
        return airport?.airport_name || null;
    }

    // Resolve airport code with fallback logic
    static resolveAirportCode(airportId, airportMap = {}) {
        // Try from provided map first
        if (airportMap[airportId]?.airport_code) {
            return airportMap[airportId].airport_code;
        }
        
        // Try from cache
        const airport = this.getAirportFromCache(airportId);
        return airport?.airport_code || null;
    }

    // Method to preload airport data into cache
    static async preloadAirports() {
        try {
            await this.getAirports();
        } catch (error) {
        }
    }

    // Method to clear cache (useful for testing or manual refresh)
    static clearCache() {
        this.airportCache.clear();
        this.lastFetchTime = 0;
    }
}
