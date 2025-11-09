const mongoose = require('mongoose');
const EmployeeService = require('../models/EmployeeService');
const Employee = require('../models/Employee');
const Salon = require('../models/Salon');
require('dotenv').config();

const sampleServices = [
  { name: 'Haircut', duration: 30, price: 300, category: 'Hair', description: 'Professional haircut and styling' },
  { name: 'Hair Wash', duration: 15, price: 150, category: 'Hair', description: 'Deep cleansing hair wash' },
  { name: 'Beard Trim', duration: 20, price: 200, category: 'Grooming', description: 'Precise beard trimming and shaping' },
  { name: 'Facial', duration: 45, price: 800, category: 'Skincare', description: 'Rejuvenating facial treatment' },
  { name: 'Head Massage', duration: 25, price: 400, category: 'Wellness', description: 'Relaxing head and scalp massage' },
  { name: 'Hair Coloring', duration: 90, price: 1500, category: 'Hair', description: 'Professional hair coloring service' },
  { name: 'Shaving', duration: 25, price: 250, category: 'Grooming', description: 'Traditional wet shave' },
  { name: 'Manicure', duration: 40, price: 600, category: 'Beauty', description: 'Complete nail care and styling' },
];

async function createSampleServices() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get all salons
    const salons = await Salon.find().limit(5);
    console.log(`Found ${salons.length} salons`);

    if (salons.length === 0) {
      console.log('No salons found. Please create salons first.');
      return;
    }

    for (const salon of salons) {
      console.log(`\nProcessing salon: ${salon.name}`);
      
      // Get employees for this salon
      const employees = await Employee.find({ salon: salon._id }).limit(3);
      console.log(`Found ${employees.length} employees for ${salon.name}`);

      if (employees.length === 0) {
        console.log(`No employees found for salon ${salon.name}, skipping...`);
        continue;
      }

      // Create services for each employee
      for (const employee of employees) {
        console.log(`Creating services for employee: ${employee.name}`);
        
        // Create 3-4 random services per employee
        const servicesToCreate = sampleServices.slice(0, Math.floor(Math.random() * 4) + 3);
        
        for (const serviceData of servicesToCreate) {
          // Check if service already exists
          const existingService = await EmployeeService.findOne({
            employee: employee._id,
            name: serviceData.name
          });

          if (!existingService) {
            const service = new EmployeeService({
              employee: employee._id,
              salon: salon._id,
              salonUser: employee.salonUser,
              name: serviceData.name,
              duration: serviceData.duration,
              price: serviceData.price,
              category: serviceData.category,
              description: serviceData.description,
              isActive: true
            });

            await service.save();
            console.log(`  ✓ Created service: ${serviceData.name} - ₹${serviceData.price}`);
          } else {
            console.log(`  - Service already exists: ${serviceData.name}`);
          }
        }
      }
    }

    console.log('\n✅ Sample services creation completed!');
    
  } catch (error) {
    console.error('Error creating sample services:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createSampleServices();
