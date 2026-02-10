const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
// In-Memory MongoDB for Testing (instead of real MongoDB)
const { MongoMemoryServer } = require('mongodb-memory-server');

const unitRouter = require('../../routes/rUnit'); 
const Unit = require('../../models/mUnit');

// --- Similate Authentication (to Bypass Login) ---
jest.mock('../../middlewares/mdAuthentication', () => ({
    verifyJWT: (req, res, next) => {
        req.user = { id: 'mock_user_id', role: 'admin' };
        next();
    }
}));

jest.mock('../../middlewares/mdAuthorisation', () => ({
    isAuthorised: (req, res, next) => next()
}));

// --- Setting up App ---
const app = express();
app.use(express.json());
app.use('/units', unitRouter);

describe('Integration Test: GET /units', () => {
    let mongoServer;

    // 1. SETUP: Start In-Memory Database
    beforeAll(async () => {
        // This spins up a fake DB in memory
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri(); 

        // Connect Mongoose to this fake DB
        await mongoose.connect(uri);
    });

    // 2. TEARDOWN: Stop Database
    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongoServer.stop();
    });

    // 3. RESET: Clear data between tests
    beforeEach(async () => {
        await Unit.deleteMany({});
    });

    // --- Test 1: Get All Units ---
    test('GET /units - Should return 200 and a list of units', async () => {
        // Step 1 (Arrange): Create a fake unit in the memory DB
        await Unit.create({
            unitno: '01-01',
            share: '5',
            size: '1000sqft',
            block: 'A',
            floor: '01',
            bedroom: '3'
        });

        // Step 2 (Act): Hit the API
        const response = await request(app).get('/units');

        // Step 3 (Assert): Check results
        expect(response.statusCode).toBe(200);
        expect(response.body.units).toHaveLength(1);
        expect(response.body.units[0].unitno).toBe('01-01');
    });

    // --- Test 2: Empty DB ---
    test('GET /units - Should return empty list if no units exist', async () => {
        const response = await request(app).get('/units');

        expect(response.statusCode).toBe(200);
        expect(response.body.units).toEqual([]);
    });
});