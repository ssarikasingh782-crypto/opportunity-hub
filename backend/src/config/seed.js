require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const SavedJob = require('../models/SavedJob');
const { ROLES, JOB_TYPES, WORK_MODES, JOB_STATUS, APPLICATION_STATUS, EXPERIENCE_LEVELS } = require('./constants');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/job_internship_portal';
    console.log(`[Seed] Connecting to database: ${mongoUri}...`);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('[Seed] Connected to database successfully.');

    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Company.deleteMany({}),
      Job.deleteMany({}),
      Application.deleteMany({}),
      SavedJob.deleteMany({}),
    ]);

    console.log('[Seed] Creating demo users...');
    // 1. Create Admin
    const adminUser = await User.create({
      name: 'Platform Administrator',
      email: 'admin@example.com',
      password: 'AdminPassword123!',
      role: ROLES.ADMIN,
      bio: 'Lead platform administrator and moderation manager.',
    });

    // 2. Create Recruiters
    const recruiter1 = await User.create({
      name: 'Sarah Connor',
      email: 'recruiter@example.com',
      password: 'Password123!',
      role: ROLES.RECRUITER,
      bio: 'Senior Technical Talent Acquisition Partner at Apex Innovations.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    });

    const recruiter2 = await User.create({
      name: 'David Miller',
      email: 'techcorp@example.com',
      password: 'Password123!',
      role: ROLES.RECRUITER,
      bio: 'Head of Engineering Talent at CloudScale Technologies.',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    });

    // 3. Create Candidates
    const candidate1 = await User.create({
      name: 'Jane Student',
      email: 'candidate@example.com',
      password: 'Password123!',
      role: ROLES.CANDIDATE,
      education: 'B.Tech in Computer Science & Engineering, Final Year',
      skills: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'JavaScript'],
      bio: 'Full-stack software developer passionate about building scalable, user-centric web applications.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      resume: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    });

    const candidate2 = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      password: 'Password123!',
      role: ROLES.CANDIDATE,
      education: 'B.E. Information Technology, 2024 Graduate',
      skills: ['Python', 'Django', 'PostgreSQL', 'Docker', 'AWS'],
      bio: 'Backend systems engineer with interest in distributed microservices and database optimization.',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      resume: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    });

    const candidate3 = await User.create({
      name: 'Priya Patel',
      email: 'priya@example.com',
      password: 'Password123!',
      role: ROLES.CANDIDATE,
      education: 'MCA, Pre-final Year',
      skills: ['React', 'TypeScript', 'Next.js', 'Figma', 'UI/UX'],
      bio: 'Frontend developer and UI enthusiast dedicated to crafting accessible digital experiences.',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      resume: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    });

    console.log('[Seed] Creating demo companies...');
    const company1 = await Company.create({
      name: 'Apex Innovations Inc',
      description: 'Apex Innovations builds industry-leading developer tools, enterprise cloud solutions, and generative AI interfaces.',
      website: 'https://apexinnovations.example.com',
      location: 'Bengaluru, India',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
      owner: recruiter1._id,
    });

    const company2 = await Company.create({
      name: 'CloudScale Networks',
      description: 'CloudScale provides high-throughput API gateways, edge computing infrastructure, and Kubernetes orchestration.',
      website: 'https://cloudscale.example.com',
      location: 'Hyderabad, India',
      logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150',
      owner: recruiter2._id,
    });

    console.log('[Seed] Creating demo job and internship listings...');
    const jobs = await Job.create([
      {
        title: 'Full Stack Engineer (MERN)',
        description: 'We are looking for an enthusiastic Full Stack Engineer to build core features for our enterprise web application.\n\nResponsibilities:\n- Design scalable RESTful APIs using Express and Node.js.\n- Build responsive, accessible frontend interfaces in React and Tailwind CSS.\n- Implement secure authentication, RBAC, and MongoDB data schemas.\n- Write unit and integration test suites.',
        company: company1._id,
        postedBy: recruiter1._id,
        type: JOB_TYPES.JOB,
        workMode: WORK_MODES.REMOTE,
        location: 'Remote, India',
        salaryMin: 800000,
        salaryMax: 1400000,
        skills: ['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS'],
        experienceLevel: EXPERIENCE_LEVELS.ENTRY,
        openings: 3,
        status: JOB_STATUS.OPEN,
      },
      {
        title: 'Frontend React Developer Intern',
        description: 'Opportunity for pre-final and final year students to work on live production React applications.\n\nQualifications:\n- Solid knowledge of modern JavaScript (ES6+), React Hooks, and CSS.\n- Familiarity with REST APIs, Axios, and Git.\n- Good problem solving and debugging skills.\n\nStipend: ₹25,000 / month with pre-placement offer (PPO) opportunity.',
        company: company1._id,
        postedBy: recruiter1._id,
        type: JOB_TYPES.INTERNSHIP,
        workMode: WORK_MODES.HYBRID,
        location: 'Bengaluru, India',
        salaryMin: 300000,
        salaryMax: 400000,
        skills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Git'],
        experienceLevel: EXPERIENCE_LEVELS.ENTRY,
        openings: 2,
        status: JOB_STATUS.OPEN,
      },
      {
        title: 'Backend API Developer (Node.js)',
        description: 'Join our infrastructure team to architect high-performance distributed microservices.\n\nRequirements:\n- Proficient with Node.js runtime, Express framework, and MongoDB indexing.\n- Deep understanding of asynchronous programming, concurrency, and caching.\n- Experience implementing JWT security and rate limiting.',
        company: company2._id,
        postedBy: recruiter2._id,
        type: JOB_TYPES.JOB,
        workMode: WORK_MODES.ONSITE,
        location: 'Hyderabad, India',
        salaryMin: 1000000,
        salaryMax: 1600000,
        skills: ['Node.js', 'Express', 'MongoDB', 'Redis', 'Docker'],
        experienceLevel: EXPERIENCE_LEVELS.MID,
        openings: 2,
        status: JOB_STATUS.OPEN,
      },
      {
        title: 'Cloud DevOps & Systems Intern',
        description: 'Exciting internship focusing on cloud automation, CI/CD pipelines, and server monitoring.\n\nKey Learnings:\n- Hands-on experience with Docker, GitHub Actions, and Linux servers.\n- Setting up Nginx reverse proxies, SSL certificates, and PM2 process managers.',
        company: company2._id,
        postedBy: recruiter2._id,
        type: JOB_TYPES.INTERNSHIP,
        workMode: WORK_MODES.REMOTE,
        location: 'Remote',
        salaryMin: 350000,
        salaryMax: 450000,
        skills: ['Linux', 'Docker', 'Git', 'GitHub Actions', 'AWS'],
        experienceLevel: EXPERIENCE_LEVELS.ENTRY,
        openings: 1,
        status: JOB_STATUS.OPEN,
      },
      {
        title: 'UI/UX & Frontend Engineer',
        description: 'Design and implement intuitive candidate and recruiter dashboards.\n\nResponsibilities:\n- Transform Figma prototypes into responsive React components.\n- Ensure cross-browser consistency and dark mode compatibility.\n- Integrate data visualization libraries (Chart.js).',
        company: company1._id,
        postedBy: recruiter1._id,
        type: JOB_TYPES.JOB,
        workMode: WORK_MODES.REMOTE,
        location: 'Remote',
        salaryMin: 700000,
        salaryMax: 1200000,
        skills: ['React', 'Figma', 'Tailwind CSS', 'Chart.js', 'TypeScript'],
        experienceLevel: EXPERIENCE_LEVELS.ENTRY,
        openings: 1,
        status: JOB_STATUS.OPEN,
      },
    ]);

    console.log('[Seed] Creating demo applications...');
    // Jane applied to Full Stack Engineer (Shortlisted)
    await Application.create({
      job: jobs[0]._id,
      candidate: candidate1._id,
      coverLetter: 'I have developed full-stack MERN applications and deployed production services.',
      resumeUrl: candidate1.resume,
      status: APPLICATION_STATUS.SHORTLISTED,
    });

    // Jane applied to React Intern (Hired)
    await Application.create({
      job: jobs[1]._id,
      candidate: candidate1._id,
      coverLetter: 'Excited about frontend performance and accessible interfaces.',
      resumeUrl: candidate1.resume,
      status: APPLICATION_STATUS.HIRED,
    });

    // Rahul applied to Backend Developer (Applied)
    await Application.create({
      job: jobs[2]._id,
      candidate: candidate2._id,
      coverLetter: 'Strong expertise in database indexing and asynchronous Node.js.',
      resumeUrl: candidate2.resume,
      status: APPLICATION_STATUS.APPLIED,
    });

    // Priya applied to UI/UX Engineer (Applied)
    await Application.create({
      job: jobs[4]._id,
      candidate: candidate3._id,
      coverLetter: 'Passionate about design systems and responsive dashboard architecture.',
      resumeUrl: candidate3.resume,
      status: APPLICATION_STATUS.APPLIED,
    });

    console.log('[Seed] Creating demo saved jobs...');
    await SavedJob.create({
      user: candidate1._id,
      job: jobs[2]._id,
    });
    await SavedJob.create({
      user: candidate1._id,
      job: jobs[3]._id,
    });

    console.log('===========================================================');
    console.log('🎉 Database Seeding Completed Successfully!');
    console.log('===========================================================');
    console.log('Demo Credentials for Examination & Testing:');
    console.log('  1. Candidate: candidate@example.com / Password123!');
    console.log('  2. Recruiter: recruiter@example.com / Password123!');
    console.log('  3. Admin:     admin@example.com     / AdminPassword123!');
    console.log('===========================================================');

    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error populating database:', error);
    process.exit(1);
  }
};

seedData();
