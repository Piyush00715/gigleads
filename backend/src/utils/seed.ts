import { connectDB } from '../config/db';
import { User } from '../models/user.model';
import { Lead } from '../models/lead.model';
import { LeadStatus, LeadSource } from '../interfaces/lead.interface';

const seedData = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing existing collections...');
    await User.deleteMany({});
    await Lead.deleteMany({});

    console.log('👤 Seeding default users...');
    
    // Create Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@smartleads.com',
      password: 'AdminPass123!',
      role: 'Admin',
    });

    // Create Sales User
    const sales = await User.create({
      name: 'Sales Rep One',
      email: 'sales@smartleads.com',
      password: 'SalesPass123!',
      role: 'Sales',
    });

    console.log(`✅ Seeded Users: Admin (${admin.email}), Sales (${sales.email})`);

    console.log('📈 Seeding mock leads...');

    const statuses: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
    const sources: LeadSource[] = ['Website', 'Instagram', 'Referral'];
    const names = [
      'John Doe', 'Jane Smith', 'Michael Johnson', 'Emily Davis', 'David Wilson',
      'Sarah Martinez', 'Robert Anderson', 'Jessica Thomas', 'William Taylor', 'Megan Moore',
      'James Jackson', 'Patricia Martin', 'Charles Lee', 'Jennifer White', 'Daniel Harris',
      'Elizabeth Clark', 'Matthew Lewis', 'Linda Robinson', 'Joseph Walker', 'Barbara Hall',
      'Thomas Allen', 'Susan Young', 'Christopher King', 'Margaret Wright', 'Nicholas Scott',
      'Karen Green', 'Andrew Baker', 'Nancy Adams', 'Steven Nelson', 'Lisa Hill'
    ];

    const leads = [];

    // Helper to generate a random date in the last N months
    const getRandomDateInPastMonths = (months: number): Date => {
      const now = new Date();
      const date = new Date(now.getTime() - Math.random() * months * 30 * 24 * 60 * 60 * 1000);
      return date;
    };

    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      const email = `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const source = sources[Math.floor(Math.random() * sources.length)];
      const assignedTo = Math.random() > 0.3 ? sales._id : admin._id;
      const createdAt = getRandomDateInPastMonths(6); // last 6 months

      leads.push({
        name,
        email,
        status,
        source,
        assignedTo,
        createdAt,
        updatedAt: createdAt,
      });
    }

    await Lead.insertMany(leads);
    console.log(`✅ Seeded ${names.length} Leads.`);

    console.log('🎉 Seeding successfully completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
