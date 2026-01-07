import { HotelBookingService } from './bookingApi';
import { CityService } from './cityApi';
import { HotelCoreService } from './hotelCoreApi';
import { MealPlanService } from './mealPlanApi';
import { NotificationService } from './notificationApi';
import { HotelPaymentService } from './paymentApi';
import { ReviewService } from './reviewApi';
import { RoomService } from './roomApi';

export class HotelService {
    // Cities
    static async getCities() { return CityService.getCities(); }
    static async createCity(cityData) { return CityService.createCity(cityData); }
    static async getCityById(id) { return CityService.getCityById(id); }
    static async updateCity(id, cityData) { return CityService.updateCity(id, cityData); }
    static async deleteCity(id) { return CityService.deleteCity(id); }

    // Hotels
    static async getHotels(params) { return HotelCoreService.getHotels(params); }
    static async createHotel(hotelData) { return HotelCoreService.createHotel(hotelData); }
    static async getHotelById(id) { return HotelCoreService.getHotelById(id); }
    static async updateHotel(id, hotelData) { return HotelCoreService.updateHotel(id, hotelData); }
    static async deleteHotel(id) { return HotelCoreService.deleteHotel(id); }
    static async getHotelsByCity(cityId) { return HotelCoreService.getHotelsByCity(cityId); }

    // Rooms
    static async getRooms(params) { return RoomService.getRooms(params); }
    static async createRoom(roomData) { return RoomService.createRoom(roomData); }
    static async getRoomById(id) { return RoomService.getRoomById(id); }
    static async updateRoom(id, roomData) { return RoomService.updateRoom(id, roomData); }
    static async getRoomsByHotel(hotelId) { return RoomService.getRoomsByHotel(hotelId); }
    static async checkRoomAvailability(params) { return RoomService.checkRoomAvailability(params); }
    static async getRoomAvailability(params) { return RoomService.getRoomAvailability(params); }
    static async createRoomAvailability(availabilityData) { return RoomService.createRoomAvailability(availabilityData); }
    static async updateRoomAvailability(id, availabilityData) { return RoomService.updateRoomAvailability(id, availabilityData); }
    static async deleteRoomAvailability(id) { return RoomService.deleteRoomAvailability(id); }
    static async getRoomCategories() { return RoomService.getRoomCategories(); }
    static async createRoomCategory(categoryData) { return RoomService.createRoomCategory(categoryData); }
    static async getRoomCategoryById(id) { return RoomService.getRoomCategoryById(id); }
    static async updateRoomCategory(id, categoryData) { return RoomService.updateRoomCategory(id, categoryData); }
    static async deleteRoomCategory(id) { return RoomService.deleteRoomCategory(id); }

    // Meal Plans
    static async getMealPlans() { return MealPlanService.getMealPlans(); }
    static async createMealPlan(mealPlanData) { return MealPlanService.createMealPlan(mealPlanData); }
    static async getMealPlanById(id) { return MealPlanService.getMealPlanById(id); }
    static async updateMealPlan(id, mealPlanData) { return MealPlanService.updateMealPlan(id, mealPlanData); }
    static async deleteMealPlan(id) { return MealPlanService.deleteMealPlan(id); }

    // Bookings
    static async getBookings(params) { return HotelBookingService.getBookings(params); }
    static async createBooking(bookingData) { return HotelBookingService.createBooking(bookingData); }
    static async getBookingById(id) { return HotelBookingService.getBookingById(id); }
    static async cancelBooking(id) { return HotelBookingService.cancelBooking(id); }
    static async updateBooking(id, bookingData) { return HotelBookingService.updateBooking(id, bookingData); }
    static async deleteBooking(id) { return HotelBookingService.deleteBooking(id); }

    // Payments
    static async createOrder(orderData) { return HotelPaymentService.createOrder(orderData); }
    static async processPayment(paymentData) { return HotelPaymentService.processPayment(paymentData); }
    static async verifyPayment(verificationData) { return HotelPaymentService.verifyPayment(verificationData); }
    static async getPaymentByBooking(bookingId) { return HotelPaymentService.getPaymentByBooking(bookingId); }
    static async getHotelPayments(params) { return HotelPaymentService.getHotelPayments(params); }
    static async refreshPaymentStatus(paymentId) { return HotelPaymentService.refreshPaymentStatus(paymentId); }
    static async processRefund(paymentId, refundData) { return HotelPaymentService.processRefund(paymentId, refundData); }

    // Reviews
    static async getHotelReviews(hotelId) { return ReviewService.getHotelReviews(hotelId); }
    static async createReview(reviewData) { return ReviewService.createReview(reviewData); }
    static async getAllHotelReviews(params) { return ReviewService.getAllHotelReviews(params); }
    static async updateReviewStatus(reviewId, statusData) { return ReviewService.updateReviewStatus(reviewId, statusData); }
    static async deleteReview(reviewId) { return ReviewService.deleteReview(reviewId); }

    // Notifications
    static async sendNotification(notificationData) { return NotificationService.sendNotification(notificationData); }
}
