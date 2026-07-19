import prisma from '../config/database.js';
import bcrypt from 'bcryptjs';

async function main() {
  const adminEmail = 'admin@worknest.com';
  const existingAdmin = await prisma.employee.findFirst({ where: { email: adminEmail } });
  
  if (existingAdmin) {
    console.log('Admin already exists!');
    console.log('Email: admin@worknest.com');
    console.log('Password: password123');
    return;
  }

  const hashedPassword = await bcrypt.hash('password123', 10);
  
  await prisma.employee.create({
    data: {
      employeeId: 'EMP-001',
      name: 'Super Admin',
      email: adminEmail,
      password: hashedPassword,
      phone: '1234567890',
      department: 'Management',
      designation: 'CEO',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      salary: 100000,
      joiningDate: new Date(),
    }
  });

  console.log('Successfully created admin account!');
  console.log('Email: admin@worknest.com');
  console.log('Password: password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
