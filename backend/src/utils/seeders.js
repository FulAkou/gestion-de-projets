import 'dotenv/config';
import { connectDB, disconnectDB } from '../config/database.js';
import Category from '../models/Category.js';
import Permission from '../models/Permission.js';
import Role from '../models/Role.js';
import User from '../models/User.js';

/**
 * Database Seeder
 * Populates the database with initial data
 */

const permissions = [
  // Categories
  { name: 'view_categories', resource: 'categories', action: 'view' },
  { name: 'create_categories', resource: 'categories', action: 'create' },
  { name: 'edit_categories', resource: 'categories', action: 'edit' },
  { name: 'delete_categories', resource: 'categories', action: 'delete' },
  
  // Clients
  { name: 'view_clients', resource: 'clients', action: 'view' },
  { name: 'create_clients', resource: 'clients', action: 'create' },
  { name: 'edit_clients', resource: 'clients', action: 'edit' },
  { name: 'delete_clients', resource: 'clients', action: 'delete' },
  
  // Projects
  { name: 'view_projects', resource: 'projects', action: 'view' },
  { name: 'create_projects', resource: 'projects', action: 'create' },
  { name: 'edit_projects', resource: 'projects', action: 'edit' },
  { name: 'delete_projects', resource: 'projects', action: 'delete' },
  
  // Tasks
  { name: 'view_tasks', resource: 'tasks', action: 'view' },
  { name: 'create_tasks', resource: 'tasks', action: 'create' },
  { name: 'edit_tasks', resource: 'tasks', action: 'edit' },
  { name: 'delete_tasks', resource: 'tasks', action: 'delete' },
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to database
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      Permission.deleteMany({}),
      Role.deleteMany({}),
      User.deleteMany({}),
      Category.deleteMany({}),
    ]);

    // Create permissions
    console.log('📝 Creating permissions...');
    const createdPermissions = await Permission.insertMany(permissions);
    console.log(`✅ Created ${createdPermissions.length} permissions`);

    // Create roles
    console.log('👥 Creating roles...');
    
    // Super Admin - all permissions
    const superAdminRole = await Role.create({
      name: 'super_admin',
      guardName: 'web',
      permissions: createdPermissions.map(p => p._id),
    });

    // Admin - all permissions except user management
    const adminPermissions = createdPermissions.filter(p => 
      !p.resource.includes('users')
    );
    const adminRole = await Role.create({
      name: 'admin',
      guardName: 'web',
      permissions: adminPermissions.map(p => p._id),
    });

    // Manager - view all, create/edit projects and tasks
    const managerPermissions = createdPermissions.filter(p => 
      p.action === 'view' ||
      (p.resource === 'projects' && p.action !== 'delete') ||
      (p.resource === 'tasks' && p.action !== 'delete')
    );
    const managerRole = await Role.create({
      name: 'manager',
      guardName: 'web',
      permissions: managerPermissions.map(p => p._id),
    });

    // User - view and edit own tasks
    const userPermissions = createdPermissions.filter(p => 
      p.action === 'view' ||
      (p.resource === 'tasks' && p.action === 'edit')
    );
    const userRole = await Role.create({
      name: 'user',
      guardName: 'web',
      permissions: userPermissions.map(p => p._id),
    });

    console.log('✅ Created 4 roles (super_admin, admin, manager, user)');

    // Create default admin user
    console.log('👤 Creating default admin user...');
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'password123', // Will be hashed automatically
      roles: [superAdminRole._id],
      emailVerifiedAt: new Date(),
    });
    console.log(`✅ Created admin user: ${adminUser.email} / password123`);

    // Create sample categories
    console.log('📁 Creating sample categories...');
    const categories = await Category.insertMany([
      { name: 'Web Development', type: 'project', description: 'Web development projects' },
      { name: 'Mobile Development', type: 'project', description: 'Mobile app projects' },
      { name: 'Design', type: 'project', description: 'Design projects' },
      { name: 'Frontend', type: 'task', description: 'Frontend development tasks' },
      { name: 'Backend', type: 'task', description: 'Backend development tasks' },
      { name: 'Bug Fix', type: 'task', description: 'Bug fixing tasks' },
    ]);
    console.log(`✅ Created ${categories.length} categories`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - Permissions: ${createdPermissions.length}`);
    console.log(`   - Roles: 4 (super_admin, admin, manager, user)`);
    console.log(`   - Users: 1 (admin@example.com)`);
    console.log(`   - Categories: ${categories.length}`);
    console.log('\n🔐 Default Admin Credentials:');
    console.log(`   Email: admin@example.com`);
    console.log(`   Password: password123`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await disconnectDB();
  }
};

// Run seeder
seedDatabase();
