import { httpClient } from '../baseApi';

export class CharterService {
    static async getCharterOptions() {
        const response = await httpClient.get('/charter/options');
        return response.data;
    }

    static async requestCharter(charterData) {
        const response = await httpClient.post('/charter/request', charterData);
        return response.data;
    }

    static async getCharterQuote(quoteData) {
        const response = await httpClient.post('/charter/quote', quoteData);
        return response.data;
    }
}
