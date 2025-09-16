const User = require('../models/User');
const Internship = require('../models/Internship');

// Seed default admin user
const seedAdminUser = async () => {
    try {
        await User.createDefaultAdmin();
    } catch (error) {
        console.error('❌ Error seeding admin user:', error.message);
    }
};

// Seed sample internships (optional - for demo purposes)
const seedSampleInternships = async () => {
    try {
        const existingInternships = await Internship.countDocuments();
        
        if (existingInternships === 0) {
            const sampleInternships = [
                {
                    mentorName: 'Dr. Hira Fatima',
                    profession: 'Clinical Psychologist',
                    specialization: 'CBT & DBT Specialist',
                    city: 'Rawalpindi',
                    cityNote: 'Student can be debuted across cities (depends on city)',
                    programs: [
                        {
                            title: 'Basic Clinical Training',
                            duration: '2 months',
                            fees: 15000,
                            mode: 'online',
                            description: 'Foundation course in clinical psychology'
                        },
                        {
                            title: 'Advanced Clinical Training',
                            duration: '3 months',
                            fees: 22000,
                            mode: 'hybrid',
                            description: 'Advanced techniques and real case studies'
                        },
                        {
                            title: 'Comprehensive Clinical Program',
                            duration: '6 months',
                            fees: 42000,
                            mode: 'offline',
                            description: 'Complete clinical psychology internship'
                        }
                    ],
                    includes: [
                        'DSM, V TR',
                        'Assessment',
                        'History Taking',
                        'CBT, DBT',
                        'Acceptance and Commitment therapy',
                        'Supportive Psychotherapy'
                    ],
                    isActive: true,
                    sortOrder: 1
                },
                {
                    mentorName: 'Dr. Anas Malik',
                    profession: 'Clinical Psychologist',
                    specialization: 'Child Psychology & Therapy',
                    city: 'Sialkot',
                    cityNote: 'Student can be debuted across multiple cities (depends on city)',
                    programs: [
                        {
                            title: 'Child Psychology Internship',
                            duration: '3 months',
                            fees: 0,
                            mode: 'online',
                            description: 'Comprehensive child psychology training'
                        }
                    ],
                    includes: [
                        'Child Psychology (All facets)',
                        'DSM V',
                        'Psychotherapy',
                        'Adult Psychopathology',
                        'Clinical Rotations',
                        'Group Therapy',
                        'Music Therapy',
                        'Contemporary practices in Clinical Psychology'
                    ],
                    isActive: true,
                    sortOrder: 2
                },
                {
                    mentorName: 'Dr. Saiqa Parveen',
                    profession: 'Clinical Psychologist',
                    specialization: 'Hypnotherapy & Counseling',
                    city: 'Lahore',
                    cityNote: 'Delivered online and in person - Student can be debuted across Lahore',
                    programs: [
                        {
                            title: 'Hypnotherapy Certification',
                            duration: '2 months',
                            fees: 20000,
                            mode: 'hybrid',
                            description: '2 sessions per week - Evening: 7:00 PM - 8:00 PM (best for working professionals)'
                        }
                    ],
                    includes: [
                        'History and science of hypnosis',
                        'Conscious, subconscious, and unconscious mind',
                        'Levels of trance (light, medium, deep)',
                        'Voice modulation, relaxation, and breathing and much more',
                        'Each week will have a practical / practice session'
                    ],
                    additionalInfo: 'Suggested days: Saturday & Wednesday. Timing options: Evening: 7:00 PM - 8:00PM (best for working professionals)',
                    isActive: true,
                    sortOrder: 3
                }
            ];

            await Internship.insertMany(sampleInternships);
            console.log('🎓 Sample internships created successfully');
            console.log(`📚 Created ${sampleInternships.length} sample internships`);
        } else {
            console.log(`📚 Database already has ${existingInternships} internships`);
        }
    } catch (error) {
        console.error('❌ Error seeding sample internships:', error.message);
    }
};

// Main seeder function
const runSeeders = async () => {
    console.log('🌱 Running database seeders...');
    
    await seedAdminUser();
    await seedSampleInternships();
    
    console.log('✅ Database seeding completed');
};

module.exports = {
    seedAdminUser,
    seedSampleInternships,
    runSeeders
};