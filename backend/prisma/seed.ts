import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Himnova AI Career Launchpad Seed Pipeline...');

  // 1. Clean existing records for clean development seed
  await prisma.auditLog.deleteMany();
  await prisma.notificationItem.deleteMany();
  await prisma.aIMessage.deleteMany();
  await prisma.aIConversation.deleteMany();
  await prisma.portfolioProject.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.rewardLedger.deleteMany();
  await prisma.referralRecord.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.paymentTransaction.deleteMany();
  await prisma.attendanceRecord.deleteMany();
  await prisma.liveClass.deleteMany();
  await prisma.assignmentSubmission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.batchStudent.deleteMany();
  await prisma.batch.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.lessonResource.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.courseModule.deleteMany();
  await prisma.course.deleteMany();
  await prisma.category.deleteMany();
  await prisma.expenseRecord.deleteMany();
  await prisma.trainerPayout.deleteMany();
  await prisma.platformSetting.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Purged previous dev records');

  // 2. Hash passwords
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const trainerPassword = await bcrypt.hash('Trainer@123', 10);
  const studentPassword = await bcrypt.hash('Student@123', 10);

  // 3. Create Seed Users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@himnova.com',
      passwordHash: adminPassword,
      fullName: 'Himnova Principal Admin',
      role: 'SUPER_ADMIN',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      phoneNumber: '+977-9823009467',
      bio: 'Enterprise Systems Director at Himnova Technologies Pvt. Ltd.',
      referralCode: 'HIMNOVA-ADMIN',
      isActive: true,
      isMfaEnabled: true,
    },
  });

  const trainer1 = await prisma.user.create({
    data: {
      email: 'trainer@himnova.com',
      passwordHash: trainerPassword,
      fullName: 'Sushil Panthi',
      role: 'TRAINER',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      phoneNumber: '+977-9800000001',
      bio: 'Lead AI Engineer & Cloud Architect at Himnova Technologies. Specializing in RAG, Agentic AI, and distributed systems.',
      referralCode: 'HIMNOVA-TRAINER-1',
      isActive: true,
    },
  });

  const trainer2 = await prisma.user.create({
    data: {
      email: 'trainer.devops@himnova.com',
      passwordHash: trainerPassword,
      fullName: 'Pooja Karki',
      role: 'TRAINER',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      phoneNumber: '+977-9800000002',
      bio: 'Senior Cloud & DevOps Engineer. AWS Certified Solutions Architect & Kubernetes specialist.',
      referralCode: 'HIMNOVA-TRAINER-2',
      isActive: true,
    },
  });

  const trainer3 = await prisma.user.create({
    data: {
      email: 'trainer.fullstack@himnova.com',
      passwordHash: trainerPassword,
      fullName: 'Nischal Adhikari',
      role: 'TRAINER',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      phoneNumber: '+977-9800000003',
      bio: 'Senior Full Stack Architect with 8+ years building enterprise SaaS, Next.js, and Go microservices.',
      referralCode: 'HIMNOVA-TRAINER-3',
      isActive: true,
    },
  });

  const primaryStudent = await prisma.user.create({
    data: {
      email: 'student@himnova.com',
      passwordHash: studentPassword,
      fullName: 'Aayush Sharma',
      role: 'STUDENT',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      phoneNumber: '+977-9841000010',
      bio: 'Aspiring AI Engineer enrolled in Himnova AI Career Launchpad cohort.',
      referralCode: 'AAYUSH-AI',
      isActive: true,
    },
  });

  // Additional students for realistic cohort metrics
  const studentNames = [
    { name: 'Priya Shrestha', email: 'priya.s@gmail.com', code: 'PRIYA-2026' },
    { name: 'Rohan Thapa', email: 'rohan.thapa@gmail.com', code: 'ROHAN-2026' },
    { name: 'Anjali Gurung', email: 'anjali.g@gmail.com', code: 'ANJALI-2026' },
    { name: 'Bibek Bhattarai', email: 'bibek.b@gmail.com', code: 'BIBEK-2026' },
    { name: 'Samriddhi Rana', email: 'samriddhi.r@gmail.com', code: 'SAM-2026' },
    { name: 'Kiran Maharjan', email: 'kiran.m@gmail.com', code: 'KIRAN-2026' },
    { name: 'Dipesh Neupane', email: 'dipesh.n@gmail.com', code: 'DIPESH-2026' },
    { name: 'Sujata Pokharel', email: 'sujata.p@gmail.com', code: 'SUJATA-2026' },
    { name: 'Manish Basnet', email: 'manish.b@gmail.com', code: 'MANISH-2026' },
    { name: 'Alisha Joshi', email: 'alisha.j@gmail.com', code: 'ALISHA-2026' },
    { name: 'Bipin Acharya', email: 'bipin.a@gmail.com', code: 'BIPIN-2026' },
  ];

  const otherStudents = [];
  for (const s of studentNames) {
    const created = await prisma.user.create({
      data: {
        email: s.email,
        passwordHash: studentPassword,
        fullName: s.name,
        role: 'STUDENT',
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(s.name)}`,
        referralCode: s.code,
        referredById: primaryStudent.id,
        isActive: true,
      },
    });
    otherStudents.push(created);
  }

  console.log(`👤 Seeded 1 Super Admin, 3 Trainers, and ${otherStudents.length + 1} Students`);

  // 4. Create 5 Production-grade Courses
  const courseAI = await prisma.course.create({
    data: {
      title: 'AI & Generative AI Engineering Masterclass',
      slug: 'ai-generative-ai-engineering',
      subtitle: 'Build Autonomous AI Agents, RAG Pipelines, Multi-Modal Systems & Deploy LLMs to Cloud',
      description: 'A flagship enterprise curriculum designed by Himnova AI engineers. Master LangChain, LangGraph, Qdrant vector search, fine-tuning, function-calling agents, and real-world deployment on AWS & Kubernetes.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
      category: 'AI & Generative AI',
      difficulty: 'ADVANCED',
      durationHours: 80,
      price: 28000,
      discountPrice: 22000,
      currency: 'NPR',
      isPublished: true,
      isFeatured: true,
      prerequisites: JSON.stringify(['Python proficiency', 'Basic Data Structures', 'Git & Linux fundamentals']),
      learningOutcomes: JSON.stringify([
        'Architect and deploy enterprise RAG pipelines with Qdrant and PostgreSQL pgvector',
        'Build autonomous agents with LangGraph and tool calling capabilities',
        'Implement production-grade LLM guardrails, rate limits, and latency optimizations',
        'Integrate local and cloud multi-modal AI APIs (Gemini 2.0, DeepSeek, Claude 3.5, OpenAI)',
        'Deploy AI models with Docker, FastAPI, and Kubernetes on AWS',
      ]),
    },
  });

  const courseFullStack = await prisma.course.create({
    data: {
      title: 'Full Stack Web Engineering (Next.js 15 & Go Microservices)',
      slug: 'full-stack-web-engineering-nextjs-go',
      subtitle: 'Build high-concurrency enterprise web platforms with modern React, Next.js App Router, Go & PostgreSQL',
      description: 'End-to-end full-stack engineering curriculum from Kathmandu to the world. Architect scalable SaaS platforms, event-driven backends, and beautiful interfaces.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
      category: 'Full Stack Web Development',
      difficulty: 'INTERMEDIATE',
      durationHours: 70,
      price: 24000,
      discountPrice: 18500,
      currency: 'NPR',
      isPublished: true,
      isFeatured: true,
      prerequisites: JSON.stringify(['HTML/CSS/JS fundamentals', 'Basic programming logic']),
      learningOutcomes: JSON.stringify([
        'Master Next.js 15 App Router, React Server Components & TailwindCSS design systems',
        'Write high-performance Go REST & gRPC microservices',
        'Design relational databases with PostgreSQL, indexing and connection pooling',
        'Integrate eSewa, Khalti, and Stripe payment processing workflows',
        'Implement RBAC, JWT rotation, and zero-trust security best practices',
      ]),
    },
  });

  const courseCloud = await prisma.course.create({
    data: {
      title: 'Cloud Architecture & DevOps Automation (AWS & Kubernetes)',
      slug: 'cloud-architecture-devops-automation',
      subtitle: 'CI/CD Pipelines, Terraform Infrastructure as Code, Docker Containers & 99.99% SLA Uptime',
      description: 'Become a certified cloud professional. Learn how Himnova runs high-availability cloud systems in production across global AWS regions.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
      category: 'Cloud & DevOps Automation',
      difficulty: 'INTERMEDIATE',
      durationHours: 65,
      price: 26000,
      discountPrice: 20000,
      currency: 'NPR',
      isPublished: true,
      isFeatured: true,
      prerequisites: JSON.stringify(['Linux commands', 'Basic networking', 'Git']),
      learningOutcomes: JSON.stringify([
        'Provision AWS infrastructure using Terraform and Ansible',
        'Containerize microservices with Docker multi-stage builds',
        'Deploy and scale production workloads on Kubernetes (EKS)',
        'Build automated GitHub Actions CI/CD pipelines with zero-downtime rolling deploys',
        'Implement Prometheus, Grafana, and 24/7 SOC telemetry monitoring',
      ]),
    },
  });

  const coursePython = await prisma.course.create({
    data: {
      title: 'Python for Enterprise Data Engineering & Analytics',
      slug: 'python-data-engineering-analytics',
      subtitle: 'Pandas, Apache Spark, Airflow pipelines, ETL pipelines and real-time dashboard analytics',
      description: 'Build enterprise ETL pipelines, transform massive datasets, and generate real-time business telemetry intelligence for modern organizations.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
      category: 'Python & Data Engineering',
      difficulty: 'BEGINNER',
      durationHours: 50,
      price: 18000,
      discountPrice: 14000,
      currency: 'NPR',
      isPublished: true,
      isFeatured: false,
      prerequisites: JSON.stringify(['Basic computer literacy']),
      learningOutcomes: JSON.stringify([
        'Master core and advanced Python programming techniques',
        'Process and clean big datasets with Pandas, Polars, and NumPy',
        'Build automated ETL pipelines with Apache Airflow',
        'Design real-time data warehouses and SQL analytics models',
      ]),
    },
  });

  const courseCyber = await prisma.course.create({
    data: {
      title: 'Cybersecurity, Ethical Hacking & SOC Engineering',
      slug: 'cybersecurity-ethical-hacking-soc',
      subtitle: 'Network Defense, Penetration Testing, Zero-Trust Architecture & Threat Hunting',
      description: 'Master offensive and defensive cybersecurity strategies to protect enterprise digital assets from modern cyber threats.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800',
      category: 'Cybersecurity & SOC',
      difficulty: 'ADVANCED',
      durationHours: 60,
      price: 25000,
      discountPrice: 19500,
      currency: 'NPR',
      isPublished: true,
      isFeatured: false,
      prerequisites: JSON.stringify(['Networking fundamentals', 'Linux/Windows administration']),
      learningOutcomes: JSON.stringify([
        'Perform web and network vulnerability assessments',
        'Analyze security logs and configure SIEM solutions',
        'Implement Zero-Trust access controls and SOC monitoring protocols',
        'Understand OWASP Top 10 vulnerabilities and remediation methods',
      ]),
    },
  });

  console.log('📚 Seeded 5 Full Courses with rich metadata');

  // 5. Create Modules and Lessons for AI Course
  const mod1 = await prisma.courseModule.create({
    data: {
      courseId: courseAI.id,
      title: 'Module 1: Foundations of LLMs & Modern AI Architecture',
      description: 'Understanding Transformers, Attention Mechanisms, Tokenization, and LLM Capabilities.',
      orderIndex: 1,
    },
  });

  const mod2 = await prisma.courseModule.create({
    data: {
      courseId: courseAI.id,
      title: 'Module 2: Enterprise RAG Pipelines & Vector Search',
      description: 'Document ingestion, chunking algorithms, embeddings, pgvector, and hybrid search retrieval.',
      orderIndex: 2,
    },
  });

  const mod3 = await prisma.courseModule.create({
    data: {
      courseId: courseAI.id,
      title: 'Module 3: Autonomous AI Agents with LangGraph & Tool Calling',
      description: 'State machines, human-in-the-loop validation, memory persistence, and multi-agent systems.',
      orderIndex: 3,
    },
  });

  const mod4 = await prisma.courseModule.create({
    data: {
      courseId: courseAI.id,
      title: 'Module 4: Production Deployment & Observability',
      description: 'Serving models with FastAPI, vLLM, Docker, CloudWatch telemetry, and security guardrails.',
      orderIndex: 4,
    },
  });

  // Module 1 Lessons
  const les1_1 = await prisma.lesson.create({
    data: {
      moduleId: mod1.id,
      title: '1.1 Introduction to the Himnova AI Career Launchpad Ecosystem',
      description: 'Welcome to your career launch journey. Overview of the curriculum, toolchains, Discord community, and the 7-stage career progression pathway.',
      type: 'VIDEO',
      durationMinutes: 18,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      slideUrl: 'https://himnovatech.com',
      contentMarkdown: `# Welcome to Himnova AI Career Launchpad\n\nThis launchpad is designed by **Himnova Technologies Pvt. Ltd.** to provide industry-level technical competencies.\n\n### Core Pillars:\n1. **Learn**: Deep conceptual foundations\n2. **Practice**: Real coding exercises & lab environments\n3. **Build**: Production-grade client projects\n4. **Certify**: Verified Himnova credentials with cryptographic QR verification\n5. **Portfolio**: Recruiter-ready showcase\n6. **Interview**: Mock tech rounds and system design evaluations\n7. **Earn**: Freelancing, enterprise employment, and global software export.`,
      isFreePreview: true,
      orderIndex: 1,
    },
  });

  const les1_2 = await prisma.lesson.create({
    data: {
      moduleId: mod1.id,
      title: '1.2 Transformer Architecture & Self-Attention Explained',
      description: 'Mathematical intuition and Python implementation of Query, Key, Value vectors and multi-head attention.',
      type: 'VIDEO',
      durationMinutes: 32,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      contentMarkdown: `## Self-Attention Mechanism\n\nAttention is calculated via:\n$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$\n\nIn this lesson, we break down why transformers scale horizontally across modern GPU clusters.`,
      isFreePreview: false,
      orderIndex: 2,
    },
  });

  const les1_3 = await prisma.lesson.create({
    data: {
      moduleId: mod1.id,
      title: '1.3 Deep Dive: Multi-Modal APIs (Gemini 2.0 Flash & Pro)',
      description: 'Working with text, vision, audio, and function calling schemas in production.',
      type: 'PDF',
      durationMinutes: 25,
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      contentMarkdown: `### Multi-Modal Function Calling Schemas\n\nGemini API allows structured output enforcement via JSON schema declarations. This ensures 100% type safety when orchestrating agent workflows.`,
      isFreePreview: false,
      orderIndex: 3,
    },
  });

  // Module 2 Lessons
  const les2_1 = await prisma.lesson.create({
    data: {
      moduleId: mod2.id,
      title: '2.1 Vector Embeddings & Similarity Math (Cosine vs Dot Product)',
      description: 'How high-dimensional vector spaces represent semantic meaning and semantic search mechanics.',
      type: 'VIDEO',
      durationMinutes: 28,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      isFreePreview: false,
      orderIndex: 1,
    },
  });

  const les2_2 = await prisma.lesson.create({
    data: {
      moduleId: mod2.id,
      title: '2.2 Building a Production RAG with pgvector & PostgreSQL',
      description: 'Step-by-step implementation of HNSW index, semantic chunking, and pre-retrieval access control.',
      type: 'VIDEO',
      durationMinutes: 45,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      isFreePreview: false,
      orderIndex: 2,
    },
  });

  // Module 3 Lessons
  const les3_1 = await prisma.lesson.create({
    data: {
      moduleId: mod3.id,
      title: '3.1 Building LangGraph Autonomous Agents with Memory & Tools',
      description: 'Creating stateful cyclical graphs, branch routing, tool execution, and state persistence.',
      type: 'VIDEO',
      durationMinutes: 50,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      isFreePreview: false,
      orderIndex: 1,
    },
  });

  // Resources for Lesson 1.1 & 2.2
  await prisma.lessonResource.create({
    data: {
      lessonId: les1_1.id,
      title: 'Himnova AI Launchpad Syllabus & Roadmaps (PDF)',
      fileType: 'PDF',
      fileSizeMb: 2.45,
      fileUrl: '/uploads/syllabus-himnova-ai.pdf',
      isDownloadable: true,
    },
  });

  await prisma.lessonResource.create({
    data: {
      lessonId: les2_2.id,
      title: 'Enterprise pgvector Starter Repository (ZIP)',
      fileType: 'ZIP',
      fileSizeMb: 12.8,
      fileUrl: '/uploads/rag-starter-template.zip',
      isDownloadable: true,
    },
  });

  // Quiz for Lesson 1.2
  await prisma.quizQuestion.create({
    data: {
      lessonId: les1_2.id,
      questionText: 'Why is the scaling factor sqrt(d_k) used in the Dot-Product Attention formula?',
      optionsJson: JSON.stringify([
        'To prevent the dot products from growing excessively large for large dimensions, which would cause small gradients in softmax.',
        'To reduce the computational complexity from O(N^2) to O(N).',
        'To normalize the output vector into a valid probability distribution.',
        'To force the attention matrix to become symmetric.',
      ]),
      correctOption: 0,
      explanation: 'For large values of d_k, the dot products grow large in magnitude, pushing the softmax function into regions with extremely small gradients. Dividing by sqrt(d_k) mitigates this issue.',
    },
  });

  // 6. Create 3 Batches
  const batch1 = await prisma.batch.create({
    data: {
      courseId: courseAI.id,
      trainerId: trainer1.id,
      name: 'Batch AI-01 (Morning Alpha Cohort)',
      code: 'HIM-AI-01-2026',
      startDate: new Date('2026-03-01'),
      endDate: new Date('2026-06-30'),
      maxStudents: 30,
      status: 'ACTIVE',
    },
  });

  const batch2 = await prisma.batch.create({
    data: {
      courseId: courseFullStack.id,
      trainerId: trainer3.id,
      name: 'Batch FS-02 (Evening Beta Cohort)',
      code: 'HIM-FS-02-2026',
      startDate: new Date('2026-03-15'),
      endDate: new Date('2026-07-15'),
      maxStudents: 35,
      status: 'ACTIVE',
    },
  });

  const batch3 = await prisma.batch.create({
    data: {
      courseId: courseCloud.id,
      trainerId: trainer2.id,
      name: 'Batch CLOUD-01 (Weekend Cloud Masterclass)',
      code: 'HIM-CLOUD-01-2026',
      startDate: new Date('2026-04-01'),
      endDate: new Date('2026-08-01'),
      maxStudents: 25,
      status: 'ACTIVE',
    },
  });

  console.log('👥 Seeded 3 Batches with trainer assignments');

  // 7. Enroll Students into Batches
  // Primary Student enrolled in AI Course
  const studentEnrollmentAI = await prisma.enrollment.create({
    data: {
      userId: primaryStudent.id,
      courseId: courseAI.id,
      batchId: batch1.id,
      progressPercentage: 65.0,
      completedLessonsCount: 4,
      totalLessonsCount: 6,
      isCompleted: false,
    },
  });

  await prisma.batchStudent.create({
    data: {
      batchId: batch1.id,
      studentId: primaryStudent.id,
    },
  });

  // Lesson progresses for primary student
  await prisma.lessonProgress.create({
    data: {
      userId: primaryStudent.id,
      lessonId: les1_1.id,
      isCompleted: true,
      lastPositionSeconds: 1080,
      completedAt: new Date(),
    },
  });

  await prisma.lessonProgress.create({
    data: {
      userId: primaryStudent.id,
      lessonId: les1_2.id,
      isCompleted: true,
      lastPositionSeconds: 1920,
      completedAt: new Date(),
    },
  });

  await prisma.lessonProgress.create({
    data: {
      userId: primaryStudent.id,
      lessonId: les1_3.id,
      isCompleted: true,
      lastPositionSeconds: 1500,
      completedAt: new Date(),
    },
  });

  await prisma.lessonProgress.create({
    data: {
      userId: primaryStudent.id,
      lessonId: les2_1.id,
      isCompleted: true,
      lastPositionSeconds: 1680,
      completedAt: new Date(),
    },
  });

  await prisma.lessonProgress.create({
    data: {
      userId: primaryStudent.id,
      lessonId: les2_2.id,
      isCompleted: false,
      lastPositionSeconds: 420,
    },
  });

  // Enroll other students across batches
  for (let i = 0; i < otherStudents.length; i++) {
    const s = otherStudents[i];
    const assignedBatch = i % 2 === 0 ? batch1 : batch2;
    const assignedCourse = i % 2 === 0 ? courseAI : courseFullStack;

    await prisma.enrollment.create({
      data: {
        userId: s.id,
        courseId: assignedCourse.id,
        batchId: assignedBatch.id,
        progressPercentage: Math.floor(Math.random() * 80) + 15,
        completedLessonsCount: Math.floor(Math.random() * 5) + 1,
        totalLessonsCount: 6,
        isCompleted: i === 0, // make first other student completed
        completedAt: i === 0 ? new Date() : null,
      },
    });

    await prisma.batchStudent.create({
      data: {
        batchId: assignedBatch.id,
        studentId: s.id,
      },
    });
  }

  // 8. Create Real Assignments & Submissions
  const assignment1 = await prisma.assignment.create({
    data: {
      lessonId: les2_2.id,
      batchId: batch1.id,
      title: 'Project 1: Architect a Multi-Tenant RAG Pipeline in PostgreSQL',
      instructions: `### Objective\nBuild a complete RAG application with the following requirements:\n1. Ingest PDF and Markdown documents\n2. Compute text embeddings using \`text-embedding-004\` or \`bge-large-en-v1.5\`\n3. Store and index chunks in PostgreSQL using pgvector (HNSW Index)\n4. Implement pre-retrieval access control ensuring users only query their authorized tenant documents\n5. Expose REST endpoints with FastAPI or Next.js API\n\n### Deliverables\n- GitHub repository URL with comprehensive README\n- Live demo URL (Vercel, Render, or AWS EC2)\n- 2-minute video walkthrough or architecture explanation.`,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      maxScore: 100,
      rubricCriteriaJson: JSON.stringify([
        'RAG Architecture & Chunking (25 pts)',
        'Pre-retrieval Security & Authorization (25 pts)',
        'Embedding Search Performance & Indexing (25 pts)',
        'Code Quality, Documentation & Testing (25 pts)',
      ]),
    },
  });

  // Primary student submission
  const sub1 = await prisma.assignmentSubmission.create({
    data: {
      assignmentId: assignment1.id,
      studentId: primaryStudent.id,
      submissionText: 'Implemented multi-tenant RAG with PostgreSQL HNSW indexing, JWT tenant claims validation, and streaming citations.',
      githubUrl: 'https://github.com/aayush-himnova/enterprise-rag-postgres',
      liveDemoUrl: 'https://rag-demo.himnovatech.com',
      status: 'APPROVED',
      score: 95,
      trainerFeedback: 'Exceptional work, Aayush! Your pre-retrieval query filtering implementation is clean, and the benchmarks on 50,000 vector embeddings show sub-12ms latency.',
      attemptNumber: 1,
      reviewedById: trainer1.id,
      reviewedAt: new Date(),
    },
  });

  // Another pending submission from Priya
  await prisma.assignmentSubmission.create({
    data: {
      assignmentId: assignment1.id,
      studentId: otherStudents[0].id,
      submissionText: 'Completed the pgvector integration with LangChain pipeline and FastAPI server.',
      githubUrl: 'https://github.com/priya-shrestha/rag-himnova',
      status: 'UNDER_REVIEW',
      attemptNumber: 1,
      submittedAt: new Date(),
    },
  });

  // 9. Create Attendance Records
  const today = new Date();
  for (let d = 5; d >= 0; d--) {
    const attendanceDate = new Date(today);
    attendanceDate.setDate(today.getDate() - d);

    // Mark for primary student
    await prisma.attendanceRecord.create({
      data: {
        batchId: batch1.id,
        studentId: primaryStudent.id,
        markedById: trainer1.id,
        date: attendanceDate,
        status: d === 3 ? 'LATE' : 'PRESENT',
        notes: d === 3 ? 'Joined 10 mins late due to connectivity check' : 'Active participation in live Q&A',
      },
    });

    // Mark for other students
    for (const st of otherStudents.slice(0, 5)) {
      await prisma.attendanceRecord.create({
        data: {
          batchId: batch1.id,
          studentId: st.id,
          markedById: trainer1.id,
          date: attendanceDate,
          status: Math.random() > 0.15 ? 'PRESENT' : 'ABSENT',
        },
      });
    }
  }

  // 10. Live Classes
  const liveClassUpcoming = await prisma.liveClass.create({
    data: {
      batchId: batch1.id,
      trainerId: trainer1.id,
      title: 'Live Workshop: Fine-Tuning Function Calling on Open Weights (Llama 3.3)',
      description: 'Hands-on live coding session on LoRA adapters, dataset curation, and deploying custom tool agents.',
      provider: 'ZOOM',
      meetingUrl: 'https://zoom.us/j/9823009467?pwd=HIMNOVA_LIVE_AI_2026',
      meetingId: '982 300 9467',
      meetingPassword: 'LAUNCH_CAREER',
      startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
      isCompleted: false,
    },
  });

  const liveClassPast = await prisma.liveClass.create({
    data: {
      batchId: batch1.id,
      trainerId: trainer1.id,
      title: 'Architecture Review: High-Performance Vector Databases Comparison',
      description: 'Comparative benchmarks of pgvector, Qdrant, Milvus, and Pinecone for enterprise deployments.',
      provider: 'GOOGLE_MEET',
      meetingUrl: 'https://meet.google.com/him-nova-ai',
      startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000),
      isCompleted: true,
    },
  });

  // 11. Payment Transactions & Coupons
  const coupon1 = await prisma.coupon.create({
    data: {
      code: 'WELCOME10',
      type: 'PERCENTAGE',
      value: 10,
      minPurchaseAmount: 10000,
      maxDiscountAmount: 3000,
      expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      usageLimit: 500,
      usageCount: 42,
      isActive: true,
    },
  });

  const coupon2 = await prisma.coupon.create({
    data: {
      code: 'AI2026',
      type: 'FIXED_AMOUNT',
      value: 4000,
      minPurchaseAmount: 20000,
      expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      usageLimit: 100,
      usageCount: 18,
      isActive: true,
    },
  });

  const coupon3 = await prisma.coupon.create({
    data: {
      code: 'CAREER25',
      type: 'PERCENTAGE',
      value: 25,
      minPurchaseAmount: 15000,
      maxDiscountAmount: 6000,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      usageLimit: 50,
      usageCount: 29,
      isActive: true,
    },
  });

  // Real verified payment transaction for primary student
  await prisma.paymentTransaction.create({
    data: {
      orderId: 'HIM-TXN-20260301-0091',
      userId: primaryStudent.id,
      courseId: courseAI.id,
      amount: 18000,
      currency: 'NPR',
      provider: 'ESEWA',
      providerTransactionId: 'ESEWA-REF-88491023',
      status: 'COMPLETED',
      couponCode: 'AI2026',
      discountAmount: 4000,
      rawCallbackPayload: JSON.stringify({
        transaction_code: 'ESEWA-REF-88491023',
        status: 'COMPLETE',
        total_amount: '18000.0',
        transaction_uuid: 'HIM-TXN-20260301-0091',
        product_code: 'EPAYTEST',
      }),
    },
  });

  // Several other payments for revenue graphs
  for (let i = 0; i < otherStudents.length; i++) {
    const st = otherStudents[i];
    await prisma.paymentTransaction.create({
      data: {
        orderId: `HIM-TXN-202603${10 + i}-00${i + 10}`,
        userId: st.id,
        courseId: i % 2 === 0 ? courseAI.id : courseFullStack.id,
        amount: i % 2 === 0 ? 22000 : 18500,
        currency: 'NPR',
        provider: i % 2 === 0 ? 'KHALTI' : 'ESEWA',
        providerTransactionId: `KHALTI-PIDX-${100000 + i}`,
        status: 'COMPLETED',
      },
    });
  }

  // 12. Referral System & Rewards
  const refRecord = await prisma.referralRecord.create({
    data: {
      referrerId: primaryStudent.id,
      refereeId: otherStudents[0].id,
      status: 'REWARDED',
      rewardAmount: 1000,
      currency: 'NPR',
      courseId: courseAI.id,
    },
  });

  await prisma.rewardLedger.create({
    data: {
      userId: primaryStudent.id,
      amount: 1000,
      currency: 'NPR',
      type: 'REFERRAL_EARNING',
      note: 'Referral bonus credited for Priya Shrestha enrollment in AI Engineering Masterclass',
    },
  });

  // 13. Certificate
  const certId = 'HIM-CERT-2026-AI-8942';
  await prisma.certificate.create({
    data: {
      certificateNumber: certId,
      studentId: primaryStudent.id,
      courseId: courseAI.id,
      batchId: batch1.id,
      completionScore: 96.5,
      qrCodeUrl: `/api/v1/certificates/${certId}/qr`,
      verificationUrl: `https://learn.himnovatech.com/verify/${certId}`,
      signatoryName: 'Himnova Academic & Engineering Council',
      signatoryTitle: 'Principal Architect & Director of AI Engineering',
      isValid: true,
    },
  });

  // 14. Student Portfolio Projects
  await prisma.portfolioProject.create({
    data: {
      studentId: primaryStudent.id,
      courseId: courseAI.id,
      title: 'VoxNova: Autonomous Voice AI Calling Agent for Enterprise Support',
      slug: 'voxnova-voice-ai-agent',
      description: 'A real-time bidirectional voice agent built with WebRTC, Whisper STT, Gemini 2.0 Flash function calling, and Cartesia TTS. Supports Nepali and English natural language workflows with sub-450ms voice latency.',
      technologiesJson: JSON.stringify(['Python', 'WebRTC', 'Gemini 2.0', 'FastAPI', 'Redis', 'Docker']),
      thumbnailUrl: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=800',
      githubUrl: 'https://github.com/aayush-himnova/voxnova-voice-bot',
      liveUrl: 'https://voxnova-demo.himnovatech.com',
      videoDemoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      trainerFeedback: 'Production-grade architecture with exceptional latency optimization and clean modular design.',
      isPublished: true,
    },
  });

  await prisma.portfolioProject.create({
    data: {
      studentId: primaryStudent.id,
      courseId: courseAI.id,
      title: 'CloudGuard: Zero-Trust Kubernetes Security Telemetry Engine',
      slug: 'cloudguard-k8s-telemetry',
      description: 'Real-time eBPF-based security monitoring tool that detects anomalous container network behavior and issues instant automated SOC alerts.',
      technologiesJson: JSON.stringify(['Go', 'eBPF', 'Kubernetes', 'Prometheus', 'Next.js 15', 'TailwindCSS']),
      thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
      githubUrl: 'https://github.com/aayush-himnova/cloudguard-k8s',
      liveUrl: 'https://cloudguard.himnovatech.com',
      isPublished: true,
    },
  });

  // 15. In-App Notifications
  await prisma.notificationItem.create({
    data: {
      userId: primaryStudent.id,
      title: 'Assignment Graded: 95/100 🎉',
      message: 'Trainer Sushil Panthi reviewed your Multi-Tenant RAG Pipeline submission with high commendation.',
      type: 'SUCCESS',
      linkUrl: '/student/assignments',
      isRead: false,
    },
  });

  await prisma.notificationItem.create({
    data: {
      userId: primaryStudent.id,
      title: 'Upcoming Live Class in 2 Days',
      message: 'Fine-Tuning Function Calling on Open Weights begins at 10:00 AM NPT on Zoom.',
      type: 'INFO',
      linkUrl: '/student/live-classes',
      isRead: false,
    },
  });

  await prisma.notificationItem.create({
    data: {
      userId: primaryStudent.id,
      title: 'Referral Bonus Credited (+Rs. 1,000)',
      message: 'Your referral code was used by Priya Shrestha. Rs. 1,000 added to your reward ledger.',
      type: 'SUCCESS',
      linkUrl: '/student/referrals',
      isRead: true,
    },
  });

  // 16. Audit Log
  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      actorEmail: admin.email,
      actorRole: admin.role,
      action: 'COURSE_PUBLISHED',
      resourceType: 'Course',
      resourceId: courseAI.id,
      metadataJson: JSON.stringify({ title: courseAI.title, price: courseAI.price }),
      ipAddress: '103.10.28.4',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: trainer1.id,
      actorEmail: trainer1.email,
      actorRole: trainer1.role,
      action: 'ASSIGNMENT_GRADED',
      resourceType: 'AssignmentSubmission',
      resourceId: sub1.id,
      metadataJson: JSON.stringify({ score: 95, studentId: primaryStudent.id }),
      ipAddress: '103.10.28.12',
    },
  });

  // 17. Seed Categories
  const catAI = await prisma.category.create({
    data: {
      name: 'AI & Generative AI',
      slug: 'ai-generative-ai',
      description: 'Autonomous agents, RAG architectures, model fine-tuning, and multi-modal AI systems.',
      icon: 'Sparkles',
      orderIndex: 1,
    },
  });

  const catWeb = await prisma.category.create({
    data: {
      name: 'Full Stack Web Engineering',
      slug: 'full-stack-web-engineering',
      description: 'Modern Next.js 15, Go microservices, high-concurrency systems, and scalable backend design.',
      icon: 'Code',
      orderIndex: 2,
    },
  });

  const catCloud = await prisma.category.create({
    data: {
      name: 'Cloud & DevOps Automation',
      slug: 'cloud-devops-automation',
      description: 'AWS infrastructure as code, Terraform, Kubernetes orchestration, and CI/CD pipelines.',
      icon: 'Cloud',
      orderIndex: 3,
    },
  });

  const catFreelance = await prisma.category.create({
    data: {
      name: 'AI Freelancing & Income Tracks',
      slug: 'ai-freelancing-income-tracks',
      description: 'Content copywriting, Virtual Assistance, Canva design, chatbots, and no-code automations.',
      icon: 'Briefcase',
      orderIndex: 4,
    },
  });

  // 18. Seed Company Expense Records
  await prisma.expenseRecord.create({
    data: {
      category: 'MARKETING',
      title: 'Meta Ads & Instagram Promotion (Batch 01)',
      amount: 45000,
      currency: 'NPR',
      date: new Date('2026-03-01'),
      notes: 'Targeted lead generation ads across Kathmandu and Pokhara tech hubs.',
      createdById: admin.id,
    },
  });

  await prisma.expenseRecord.create({
    data: {
      category: 'INSTRUCTOR_PAYOUT',
      title: 'Trainer Advance Payment - Sushil Panthi (Lead AI Trainer)',
      amount: 50000,
      currency: 'NPR',
      date: new Date('2026-03-05'),
      notes: 'Initial stipend for 50-class AI Career Launchpad delivery.',
      createdById: admin.id,
    },
  });

  await prisma.expenseRecord.create({
    data: {
      category: 'PLATFORM_TOOLS',
      title: 'Zoom Enterprise Webinar & AWS Cloud Servers',
      amount: 25000,
      currency: 'NPR',
      date: new Date('2026-03-02'),
      notes: 'Dedicated 500-seat live video streaming & PostgreSQL RDS instances.',
      createdById: admin.id,
    },
  });

  // 19. Seed Trainer Payouts
  await prisma.trainerPayout.create({
    data: {
      trainerId: trainer1.id,
      batchId: batch1.id,
      amount: 75000,
      currency: 'NPR',
      classesCount: 25,
      paymentMethod: 'BANK_TRANSFER',
      accountDetails: 'Global IME Bank - A/C 01201010023412 (Sushil Panthi)',
      referenceId: 'GIBL-TXN-894102',
      status: 'PAID',
      paidAt: new Date('2026-03-10'),
      notes: 'Mid-term teaching payout for Morning AI Alpha cohort.',
      createdById: admin.id,
    },
  });

  await prisma.trainerPayout.create({
    data: {
      trainerId: trainer2.id,
      batchId: batch3.id,
      amount: 60000,
      currency: 'NPR',
      classesCount: 20,
      paymentMethod: 'ESEWA',
      accountDetails: 'eSewa ID: 9800000002 (Pooja Karki)',
      referenceId: 'ESEWA-PAYOUT-33214',
      status: 'PENDING',
      notes: 'Pending end-of-month reconciliation for Cloud DevOps weekend batch.',
      createdById: admin.id,
    },
  });

  // 20. Seed Offline QR Manual Payment Claims (Pending Verification by Super Admin)
  await prisma.paymentTransaction.create({
    data: {
      orderId: 'QR-MANUAL-2026-901',
      userId: otherStudents[0].id,
      courseId: courseAI.id,
      amount: 19999,
      currency: 'NPR',
      provider: 'QR_PAYMENT',
      providerTransactionId: 'ESEWA-REF-894721',
      senderName: 'Bikram Thapa',
      senderPhone: '+977-9811223344',
      bankWalletName: 'eSewa Wallet',
      receiptScreenshotUrl: '/logos/QR Code.jpeg',
      status: 'PENDING_VERIFICATION',
      adminNotes: 'Student scanned Himnova QR code and submitted slip. Pending admin approval.',
    },
  });

  console.log('✅ Seed complete: All LMS, Categories, Expenses, Trainer Payouts, and Payment models populated.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
