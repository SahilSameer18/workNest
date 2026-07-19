import prisma from '../config/database.js';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Clearing existing database records...');
  await prisma.employee.deleteMany({});

  const hashedPassword = await bcrypt.hash('password123', 10);

  console.log('Seeding employees...');

  // 1. CEO (Super Admin) - Top Level
  const ceo = await prisma.employee.create({
    data: {
      employeeId: 'EMP001',
      name: 'Sarah Jenkins',
      email: 'admin@worknest.com',
      password: hashedPassword,
      phone: '9876543210',
      department: 'Management',
      designation: 'CEO',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      salary: 2400000,
      joiningDate: new Date('2024-01-15'),
      profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah'
    }
  });

  // 2. VP of Engineering (HR Manager) - Reports to CEO
  const vpEng = await prisma.employee.create({
    data: {
      employeeId: 'EMP002',
      name: 'Marcus Chen',
      email: 'marcus@worknest.com',
      password: hashedPassword,
      phone: '9876543211',
      department: 'Engineering',
      designation: 'VP of Engineering',
      role: 'HR_MANAGER',
      status: 'ACTIVE',
      salary: 1800000,
      joiningDate: new Date('2024-03-01'),
      reportingManagerId: ceo.id,
      profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Marcus'
    }
  });

  // 3. HR Director (HR Manager) - Reports to CEO
  const hrDirector = await prisma.employee.create({
    data: {
      employeeId: 'EMP003',
      name: 'Elena Rostova',
      email: 'elena@worknest.com',
      password: hashedPassword,
      phone: '9876543212',
      department: 'Human Resources',
      designation: 'HR Director',
      role: 'HR_MANAGER',
      status: 'ACTIVE',
      salary: 1500000,
      joiningDate: new Date('2024-02-10'),
      reportingManagerId: ceo.id,
      profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Elena'
    }
  });

  // 4. Engineering Manager (Employee) - Reports to VP of Engineering
  const engManager = await prisma.employee.create({
    data: {
      employeeId: 'EMP004',
      name: 'David Miller',
      email: 'david@worknest.com',
      password: hashedPassword,
      phone: '9876543213',
      department: 'Engineering',
      designation: 'Engineering Manager',
      role: 'EMPLOYEE',
      status: 'ACTIVE',
      salary: 1400000,
      joiningDate: new Date('2024-06-15'),
      reportingManagerId: vpEng.id,
      profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=David'
    }
  });

  // 5. HR Specialist (HR Manager) - Reports to HR Director
  await prisma.employee.create({
    data: {
      employeeId: 'EMP005',
      name: 'Chloe Smith',
      email: 'chloe@worknest.com',
      password: hashedPassword,
      phone: '9876543214',
      department: 'Human Resources',
      designation: 'HR Specialist',
      role: 'HR_MANAGER',
      status: 'ACTIVE',
      salary: 800000,
      joiningDate: new Date('2024-08-01'),
      reportingManagerId: hrDirector.id,
      profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Chloe'
    }
  });

  // 6. Senior React Developer (Employee) - Reports to Engineering Manager
  await prisma.employee.create({
    data: {
      employeeId: 'EMP006',
      name: 'Aarav Sharma',
      email: 'aarav@worknest.com',
      password: hashedPassword,
      phone: '9876543215',
      department: 'Engineering',
      designation: 'Senior Developer',
      role: 'EMPLOYEE',
      status: 'ACTIVE',
      salary: 1100000,
      joiningDate: new Date('2024-09-10'),
      reportingManagerId: engManager.id,
      profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Aarav'
    }
  });

  // 7. Node.js Engineer (Employee) - Reports to Engineering Manager
  await prisma.employee.create({
    data: {
      employeeId: 'EMP007',
      name: 'Jessica Taylor',
      email: 'jessica@worknest.com',
      password: hashedPassword,
      phone: '9876543216',
      department: 'Engineering',
      designation: 'Software Engineer',
      role: 'EMPLOYEE',
      status: 'ACTIVE',
      salary: 950000,
      joiningDate: new Date('2024-11-01'),
      reportingManagerId: engManager.id,
      profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Jessica'
    }
  });

  // 8. UI/UX Designer (Employee) - Reports to VP of Engineering
  await prisma.employee.create({
    data: {
      employeeId: 'EMP008',
      name: 'Liam O\'Connor',
      email: 'liam@worknest.com',
      password: hashedPassword,
      phone: '9876543217',
      department: 'Engineering',
      designation: 'UI/UX Designer',
      role: 'EMPLOYEE',
      status: 'ACTIVE',
      salary: 900000,
      joiningDate: new Date('2024-07-20'),
      reportingManagerId: vpEng.id,
      profileImage: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Liam'
    }
  });

  console.log('Seeding completed successfully!');
  console.log('--------------------------------------------------');
  console.log('Primary Login Credentials:');
  console.log('Email: admin@worknest.com');
  console.log('Password: password123');
  console.log('--------------------------------------------------');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

