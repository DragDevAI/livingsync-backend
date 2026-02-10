const mongoose = require('mongoose');
const Account = require('../../models/mAccount'); 
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const seedUser = async () => {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        console.error("Error: DATABASE_URL is missing. Check your .env path!");
        process.exit(1);
    }
    
    console.log(`Connecting to: ${dbUrl.includes('mongodb+srv') ? 'Atlas Cloud' : 'Localhost'}...`);

    try {
        await mongoose.connect(dbUrl);
        
        const testOwner = {
            name: 'BDDTestOwner', 
            password: 'password123',
            unitno: '99-99',
            role: 'owner',
            verified: true 
        };

        await Account.deleteMany({ name: testOwner.name });
        
        const hashedPassword = await bcrypt.hash(testOwner.password, 10);
        
        await Account.create({
            ...testOwner,
            password: hashedPassword
        });

        console.log("Test User Seeded: BDDTestOwner");
    } catch (error) {
        console.error("Seeding Failed:", error);
    } finally {
        await mongoose.connection.close();
    }
};

seedUser();