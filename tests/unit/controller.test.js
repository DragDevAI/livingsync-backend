// This is a sample unit test file for the controllers in the application
const { createRequest, createResponse } = require('node-mocks-http');

const Account = require('../../models/mAccount');
const Visitor = require('../../models/mVisitor');
const BBQ = require('../../models/mBBQ');
const FunctionRoom = require('../../models/mFunction');
const Report = require('../../models/mReport');

const authController = require('../../controllers/cAccount');
const visitorController = require('../../controllers/cVisitor');
const bbqController = require('../../controllers/cBBQ');
const functionController = require('../../controllers/cFunction');
const reportController = require('../../controllers/cReport');

const bcrypt = require('bcrypt');

// Mocking all the models to avoid touching the database.
jest.mock('../../models/mAccount');
jest.mock('../../models/mVisitor');
jest.mock('../../models/mBBQ');
jest.mock('../../models/mFunction');
jest.mock('../../models/mReport');
jest.mock('bcrypt');

describe('LivingSync Backend Controller Tests', () => {
    let req, res, next;

    // Reset mocks before each test to ensure isolation
    beforeEach(() => {
        req = createRequest();
        res = createResponse();
        next = jest.fn();
        jest.clearAllMocks();

        const mockUser = { 
            id: 'user_id_123', 
            unitno: '01-01', 
            role: 'owner',
            email: 'testuser@gmail.com'
        };

        req.user = mockUser;
        req.decoded = mockUser; 
        req.body = { ...req.body, unitno: '01-01' };
    });

    // Unit Test 1: Create Account
    test('Create Account: Should create a new account if email is unique', async () => {
        // --- Step 1: Arrange ---
        const userData = { name: 'Test User', email: 'testuser@gmail.com', password: 'password123', unitno: '01-01', role: 'owner' };
        req.body = userData;

        // Check for existing email returns null -- Stub
        Account.findOne.mockResolvedValue(null);
        Account.find.mockResolvedValue([]);

        // Hashing password mock -- Stub
        bcrypt.hash.mockResolvedValue('hashed_password_123');
        // Mock account creation -- Mock
        Account.create.mockResolvedValue({ ...userData, _id: 'mock_id', password: 'hashed_password_123' });

        // Verify res.status is called with specific value -- Spy
        const statusSpy = jest.spyOn(res, 'status');
        
        // --- Step 2: Act ---
        await authController.createAccount(req, res, next);

        // --- Step 3: Assert ---
        const createCalled = Account.create.mock.calls.length > 0;
        const findCalled = Account.findOne.mock.calls.length > 0;
        
        expect(createCalled || findCalled).toBe(true);
        expect(statusSpy).toHaveBeenCalledWith(201);
    });
    
    // Unit Test 2: Visitor Registration
    test('Visitor Registration: Should register a visitor successfully', async () => {
        // --- Step 1: Arrange ---
        req.body = {
            unitno: '01-01',
            paxnum: 3,
            visitdate: '2026-12-25',
            drives: false
        };

        // Mock Visitor creation -- Mock
        Visitor.create.mockResolvedValue(req.body);

        // --- Step 2: Act ---
        await visitorController.createVisitor(req, res, next);

        // --- Step 3: Assert ---
        expect(Visitor.create).toHaveBeenCalled();
        expect(res.statusCode).toBe(201);
        expect(res._getJSONData().message).toMatch(/Visitor.*(registered)/i);
    });

    // Unit Test 3: BBQ Booking
    test('BBQ Booking: Should book BBQ pit if date is available', async () => {
        // --- Step 1: Arrange ---
        req.body = { unitno: '01-01', burndate: '2026-05-20' };

        // Check for existing booking (handle findOne and count) -- Stub
        BBQ.findOne.mockResolvedValue(null);
        BBQ.countDocuments.mockResolvedValue(0);
        
        // Mock BBQ booking creation -- Mock
        BBQ.create.mockResolvedValue({ ...req.body, status: 'Booked' });

        // --- Step 2: Act ---
        await bbqController.createBBQ(req, res, next);

        // --- Step 3: Assert ---
        expect(BBQ.create).toHaveBeenCalled();
        expect(res.statusCode).toBe(201);
    });

    // Unit Test 4: Function Room Booking
    test('Function Room: Should fail if date is already booked', async () => {
        // --- Step 1: Arrange ---
        req.body = { unitno: '01-01', playdate: '2026-12-31' };

        // Date already booked -- Stub
        const existingBooking = { unitno: '05-05', playdate: '2026-12-31' };
        FunctionRoom.findOne.mockResolvedValue(existingBooking);
        FunctionRoom.find.mockResolvedValue([existingBooking]);
        FunctionRoom.countDocuments.mockResolvedValue(1);

        // --- Step 2: Act ---
        await functionController.createFunction(req, res, next);

        // --- Step 3: Assert ---
        // Expect a 400 or 409 Conflict error
        expect(res.statusCode).not.toBe(201); 
        expect(res._getJSONData().message).toMatch(/Sorry, fully booked for this date./i);
        // Ensure create was NEVER called
        expect(FunctionRoom.create).not.toHaveBeenCalled();
    });

    // Unit Test 5: Report Issue
    test('Report Issue: Should submit report with status "Received"', async () => {
        // --- Step 1: Arrange ---
        req.body = {
            unitno: '01-01',
            location: 'Lift Lobby',
            description: 'Light is flickering'
        };

        const mockReport = {
            ...req.body,
            status: 'Received',
            _id: 'rep_123'
        };

        // Mock Report creation -- Mock
        Report.create.mockResolvedValue(mockReport);

        // Spy on the JSON response -- Spy
        const jsonSpy = jest.spyOn(res, 'json');

        // --- Step 2: Act ---
        await reportController.createReport(req, res, next);

        // --- Step 3: Assert ---
        expect(Report.create).toHaveBeenCalledWith(expect.objectContaining({
            location: 'Lift Lobby',
            description: 'Light is flickering'
        }));
        
        expect(jsonSpy).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.stringContaining('successfully created'),
            report: mockReport
        }));
        expect(res.statusCode).toBe(201);
    });
});