import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CITIES = [
  { city: "Mumbai", state: "Maharashtra" },
  { city: "Bengaluru", state: "Karnataka" },
  { city: "Delhi", state: "Delhi" },
  { city: "Pune", state: "Maharashtra" },
  { city: "Hyderabad", state: "Telangana" },
  { city: "Chennai", state: "Tamil Nadu" },
  { city: "Kolkata", state: "West Bengal" },
  { city: "Jaipur", state: "Rajasthan" },
  { city: "Ahmedabad", state: "Gujarat" },
  { city: "Chandigarh", state: "Punjab" },
  { city: "Gurgaon", state: "Haryana" },
  { city: "Kochi", state: "Kerala" },
];

const MALE_NAMES = [
  { first: "Rohan", last: "Sharma" },
  { first: "Aditya", last: "Verma" },
  { first: "Kabir", last: "Mehta" },
  { first: "Arjun", last: "Nair" },
  { first: "Vikram", last: "Singhania" },
  { first: "Siddharth", last: "Deshmukh" },
  { first: "Varun", last: "Kapoor" },
  { first: "Dhruv", last: "Patel" },
  { first: "Aman", last: "Bansal" },
  { first: "Kunal", last: "Chopra" },
  { first: "Nikhil", last: "Rao" },
  { first: "Pranav", last: "Iyer" },
  { first: "Gaurav", last: "Bhatia" },
  { first: "Rahul", last: "Sen" },
  { first: "Rishi", last: "Mukherjee" },
  { first: "Harsh", last: "Agarwal" },
  { first: "Tanmay", last: "Joshi" },
  { first: "Samir", last: "Reddy" },
  { first: "Dev", last: "Malhotra" },
  { first: "Karan", last: "Khurana" },
  { first: "Anand", last: "Menon" },
  { first: "Abhinav", last: "Gupta" },
  { first: "Sameer", last: "Pillai" },
  { first: "Tarun", last: "Choudhury" },
  { first: "Yash", last: "Saxena" },
  { first: "Akash", last: "Kulkarni" },
  { first: "Manish", last: "Trivedi" },
  { first: "Rajat", last: "Sood" },
  { first: "Vivek", last: "Namboodiri" },
  { first: "Kartik", last: "Sengupta" },
  { first: "Sanjay", last: "Bose" },
  { first: "Deepak", last: "Chauhan" },
  { first: "Naveen", last: "Swaminathan" },
  { first: "Mohit", last: "Dubey" },
  { first: "Alok", last: "Mishra" },
  { first: "Vishal", last: "Thakur" },
  { first: "Pritam", last: "Ghosh" },
  { first: "Ayush", last: "Bhardwaj" },
  { first: "Sumit", last: "Shukla" },
  { first: "Hemant", last: "Puri" },
  { first: "Saurabh", last: "Pandey" },
  { first: "Rajesh", last: "Shetty" },
  { first: "Gautam", last: "Venkatesh" },
  { first: "Mayank", last: "Sinha" },
  { first: "Kailash", last: "Mahajan" },
  { first: "Shantanu", last: "Bhatt" },
  { first: "Anirudh", last: "Vaidya" },
  { first: "Nirav", last: "Shah" },
  { first: "Chirag", last: "Doshi" },
  { first: "Sanket", last: "Kadam" },
  { first: "Bhavin", last: "Modi" },
  { first: "Hiren", last: "Mehta" },
  { first: "Ashish", last: "Tiwari" },
  { first: "Ankit", last: "Rawat" },
  { first: "Keshav", last: "Tripathi" },
  { first: "Rupesh", last: "Gowda" },
  { first: "Sujay", last: "Chatterjee" },
  { first: "Tushar", last: "Khatri" },
  { first: "Uday", last: "Pawar" },
  { first: "Zubin", last: "Irani" },
  { first: "Milind", last: "Soman" },
  { first: "Jayesh", last: "Thakkar" },
];

const FEMALE_NAMES = [
  { first: "Ananya", last: "Deshmukh" },
  { first: "Pooja", last: "Mehta" },
  { first: "Rhea", last: "Kapoor" },
  { first: "Meera", last: "Nambiar" },
  { first: "Ishita", last: "Singhania" },
  { first: "Tanvi", last: "Verma" },
  { first: "Shruti", last: "Patel" },
  { first: "Sneha", last: "Bansal" },
  { first: "Radhika", last: "Chopra" },
  { first: "Divya", last: "Rao" },
  { first: "Kavya", last: "Iyer" },
  { first: "Priyanka", last: "Bhatia" },
  { first: "Sanya", last: "Sen" },
  { first: "Ayesha", last: "Mukherjee" },
  { first: "Nandini", last: "Agarwal" },
  { first: "Tara", last: "Joshi" },
  { first: "Kritika", last: "Reddy" },
  { first: "Simran", last: "Malhotra" },
  { first: "Diya", last: "Khurana" },
  { first: "Anushka", last: "Menon" },
  { first: "Natasha", last: "Gupta" },
  { first: "Shreya", last: "Pillai" },
  { first: "Sakshi", last: "Choudhury" },
  { first: "Aditi", last: "Saxena" },
  { first: "Pragya", last: "Kulkarni" },
  { first: "Juhi", last: "Trivedi" },
  { first: "Avani", last: "Sood" },
  { first: "Malavika", last: "Namboodiri" },
  { first: "Rupali", last: "Sengupta" },
  { first: "Sayali", last: "Bose" },
  { first: "Nikita", last: "Chauhan" },
  { first: "Vidya", last: "Swaminathan" },
  { first: "Pallavi", last: "Dubey" },
  { first: "Garima", last: "Mishra" },
  { first: "Swati", last: "Thakur" },
  { first: "Mitali", last: "Ghosh" },
  { first: "Shweta", last: "Bhardwaj" },
  { first: "Deepika", last: "Shukla" },
  { first: "Aparna", last: "Puri" },
  { first: "Lavanya", last: "Pandey" },
  { first: "Preeti", last: "Shetty" },
  { first: "Sunita", last: "Venkatesh" },
  { first: "Pooja", last: "Sinha" },
  { first: "Richa", last: "Mahajan" },
  { first: "Smriti", last: "Bhatt" },
  { first: "Trisha", last: "Vaidya" },
  { first: "Devika", last: "Shah" },
  { first: "Bhairavi", last: "Doshi" },
  { first: "Tanushree", last: "Kadam" },
  { first: "Manasi", last: "Modi" },
  { first: "Esha", last: "Thakkar" },
  { first: "Monika", last: "Tiwari" },
  { first: "Gayatri", last: "Rawat" },
  { first: "Ira", last: "Tripathi" },
  { first: "Shalini", last: "Gowda" },
  { first: "Soma", last: "Chatterjee" },
  { first: "Gitali", last: "Khatri" },
  { first: "Varsha", last: "Pawar" },
  { first: "Roxanne", last: "Irani" },
  { first: "Bhavna", last: "Kothari" },
  { first: "Komal", last: "Gandhi" },
  { first: "Aashi", last: "Chhabra" },
  { first: "Vandana", last: "Garg" },
];

const PROFESSIONS = [
  { desig: "Senior Software Engineer", ind: "Technology", deg: "B.Tech Computer Science", high: "BACHELORS", inc: 28 },
  { desig: "VP Product Management", ind: "Technology", deg: "MBA", high: "MASTERS", inc: 48 },
  { desig: "Investment Banker", ind: "Financial Services", deg: "MBA Finance", high: "MASTERS", inc: 55 },
  { desig: "Management Consultant", ind: "Consulting", deg: "MBA", high: "MASTERS", inc: 42 },
  { desig: "Lead Data Scientist", ind: "Artificial Intelligence", deg: "M.Tech Data Science", high: "MASTERS", inc: 36 },
  { desig: "Doctor (Cardiologist)", ind: "Healthcare", deg: "MD Cardiology", high: "DOCTORATE", inc: 50 },
  { desig: "Corporate Lawyer", ind: "Legal Services", deg: "LLM Corporate Law", high: "MASTERS", inc: 35 },
  { desig: "Chartered Accountant", ind: "Accounting & Tax", deg: "CA & B.Com", high: "MASTERS", inc: 30 },
  { desig: "Architect & Urban Designer", ind: "Architecture", deg: "B.Arch", high: "BACHELORS", inc: 22 },
  { desig: "Founder & CEO", ind: "E-Commerce", deg: "B.Tech & MBA", high: "MASTERS", inc: 70 },
  { desig: "Assistant Professor", ind: "Higher Education", deg: "Ph.D. Economics", high: "DOCTORATE", inc: 18 },
  { desig: "Creative Director", ind: "Design & Media", deg: "B.Des Communication", high: "BACHELORS", inc: 25 },
  { desig: "Civil Servant (IAS)", ind: "Public Administration", deg: "MA Public Policy", high: "MASTERS", inc: 19 },
  { desig: "Risk Management Analyst", ind: "Banking", deg: "M.Sc Financial Risk", high: "MASTERS", inc: 24 },
  { desig: "Hardware Design Engineer", ind: "Semiconductors", deg: "M.Tech VLSI", high: "MASTERS", inc: 38 },
];

const LANGUAGES = [
  "Hindi", "Marathi", "Punjabi", "Gujarati", "Tamil", "Telugu", "Bengali", "Kannada", "Malayalam"
];

const HOBBIES_LIST = [
  ["Reading", "Travel", "Photography"],
  ["Cooking", "Yoga", "Trekking"],
  ["Classical Music", "Art & Painting", "Literature"],
  ["Marathon Running", "Podcasts", "Specialty Coffee"],
  ["Cinema", "Board Games", "Culinary Exploration"],
  ["Scuba Diving", "Hiking", "Cycling"],
  ["Badminton", "Gardening", "Volunteering"],
];

const JOURNEY_STAGES = [
  "ACTIVE_MATCHMAKING",
  "MATCH_SUGGESTED",
  "MEETING_SCHEDULED",
  "VERIFIED",
  "FOLLOW_UP_REQUIRED",
  "SUCCESSFULLY_MATCHED",
  "NEW_LEAD",
  "PROFILE_INCOMPLETE",
  "ON_HOLD",
];

async function main() {
  console.log("🌱 Starting TDC Matchmaker seed pipeline...");

  // 1. Clean existing records for idempotent seed
  await prisma.activityLog.deleteMany({});
  await prisma.followUp.deleteMany({});
  await prisma.customerNote.deleteMany({});
  await prisma.matchInteraction.deleteMany({});
  await prisma.matchRecommendation.deleteMany({});
  await prisma.partnerPreference.deleteMany({});
  await prisma.customerProfile.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create Seed Matchmaker Account
  const passwordHash = await bcrypt.hash("password123", 10);
  const matchmakerUser = await prisma.user.create({
    data: {
      email: "matchmaker@tdc.com",
      name: "Priya Nambiar",
      passwordHash,
      role: "MATCHMAKER",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    },
  });
  console.log(`✅ Seeded Matchmaker User: ${matchmakerUser.email} (Password: password123)`);

  const createdCustomers: any[] = [];

  // Helper for generating birth date
  const generateDOB = (ageYears: number) => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - ageYears);
    d.setMonth(Math.floor(Math.random() * 12));
    d.setDate(Math.floor(Math.random() * 28) + 1);
    return d;
  };

  // 3. Generate 62 Male Profiles
  for (let i = 0; i < MALE_NAMES.length; i++) {
    const name = MALE_NAMES[i];
    const cityObj = CITIES[i % CITIES.length];
    const prof = PROFESSIONS[i % PROFESSIONS.length];
    const age = 27 + (i % 12);
    const code = `TDC-M${(101 + i).toString().padStart(3, "0")}`;
    const motherTongue = LANGUAGES[i % LANGUAGES.length];
    const stage = JOURNEY_STAGES[i % JOURNEY_STAGES.length];
    const isVerified = i % 5 !== 0; // 80% verified

    const profile = await prisma.customerProfile.create({
      data: {
        customerCode: code,
        firstName: name.first,
        lastName: name.last,
        gender: "MALE",
        dateOfBirth: generateDOB(age),
        heightCm: 172 + (i % 15),
        email: `${name.first.toLowerCase()}.${name.last.toLowerCase()}@example.com`,
        phone: `+91 98${(70000000 + i * 137).toString().slice(0, 8)}`,
        city: cityObj.city,
        state: cityObj.state,
        country: "India",
        maritalStatus: i === 7 ? "DIVORCED" : "NEVER_MARRIED",
        isVerified,
        verificationNotes: isVerified ? "Aadhaar and academic degrees verified by operations." : "Pending government ID scan.",
        undergraduateCollege: i % 2 === 0 ? "IIT Bombay" : "BITS Pilani",
        degree: prof.deg,
        highestEducation: prof.high,
        currentCompany: i % 2 === 0 ? "Google India" : "McKinsey & Co",
        designation: prof.desig,
        industry: prof.ind,
        employmentType: "PRIVATE",
        annualIncome: prof.inc,
        incomeCurrency: "INR",
        religion: i % 10 === 0 ? "SIKH" : i % 8 === 0 ? "JAIN" : "HINDU",
        caste: "Voluntarily supplied",
        motherTongue,
        otherLanguages: JSON.stringify(["English", motherTongue !== "Hindi" ? "Hindi" : "Marathi"]),
        familyType: i % 3 === 0 ? "JOINT" : "NUCLEAR",
        familyValues: i % 4 === 0 ? "TRADITIONAL" : i % 3 === 0 ? "LIBERAL" : "MODERATE",
        familyLocation: cityObj.city,
        fatherOccupation: "Retired Senior Executive",
        motherOccupation: "Homemaker",
        siblingsCount: i % 3,
        wantChildren: i % 7 === 0 ? "NO" : i % 5 === 0 ? "MAYBE" : "YES",
        openToRelocate: i % 3 === 0 ? "YES" : i % 4 === 0 ? "MAYBE" : "NO",
        openToPets: i % 4 === 0 ? "NO" : "YES",
        diet: i % 2 === 0 ? "VEGETARIAN" : i % 5 === 0 ? "EGGETARIAN" : "NON_VEGETARIAN",
        smoking: i % 8 === 0 ? "OCCASIONALLY" : "NEVER",
        drinking: i % 4 === 0 ? "NEVER" : "SOCIALLY",
        hobbies: JSON.stringify(HOBBIES_LIST[i % HOBBIES_LIST.length]),
        marriageTimeline: "6_TO_12_MONTHS",
        journeyStage: stage,
        profileCompleteness: 85 + (i % 15),
        assignedMatchmakerId: matchmakerUser.id,
        lastContactedAt: new Date(Date.now() - (i * 2 + 1) * 86400000),
        nextFollowUpDate: new Date(Date.now() + ((i % 5) - 2) * 86400000),
        internalNotes: "High intent client. Focus on career compatibility and family alignment.",
        partnerPreference: {
          create: {
            minAge: age - 4,
            maxAge: age + 1,
            minHeightCm: 155,
            maxHeightCm: 175,
            preferredCities: JSON.stringify([cityObj.city, "Mumbai", "Bengaluru", "Pune"]),
            preferredEducation: JSON.stringify(["MASTERS", "BACHELORS"]),
            maritalStatusPreferences: JSON.stringify(["NEVER_MARRIED"]),
            wantChildrenPreference: "YES",
            dietPreferences: JSON.stringify(["VEGETARIAN", "EGGETARIAN"]),
            dealbreakers: JSON.stringify(i % 3 === 0 ? ["MARITAL_STATUS", "CHILDREN"] : ["MARITAL_STATUS"]),
          },
        },
      },
      include: { partnerPreference: true },
    });
    createdCustomers.push(profile);
  }

  // 4. Generate 63 Female Profiles
  for (let i = 0; i < FEMALE_NAMES.length; i++) {
    const name = FEMALE_NAMES[i];
    const cityObj = CITIES[(i + 3) % CITIES.length];
    const prof = PROFESSIONS[(i + 2) % PROFESSIONS.length];
    const age = 25 + (i % 11);
    const code = `TDC-F${(101 + i).toString().padStart(3, "0")}`;
    const motherTongue = LANGUAGES[(i + 2) % LANGUAGES.length];
    const stage = JOURNEY_STAGES[(i + 2) % JOURNEY_STAGES.length];
    const isVerified = i % 6 !== 0;

    const profile = await prisma.customerProfile.create({
      data: {
        customerCode: code,
        firstName: name.first,
        lastName: name.last,
        gender: "FEMALE",
        dateOfBirth: generateDOB(age),
        heightCm: 160 + (i % 12),
        email: `${name.first.toLowerCase()}.${name.last.toLowerCase()}@example.com`,
        phone: `+91 97${(60000000 + i * 179).toString().slice(0, 8)}`,
        city: cityObj.city,
        state: cityObj.state,
        country: "India",
        maritalStatus: i === 12 ? "DIVORCED" : "NEVER_MARRIED",
        isVerified,
        verificationNotes: isVerified ? "Degrees verified from University portal." : "Awaiting address verification document.",
        undergraduateCollege: i % 2 === 0 ? "St. Stephen's College" : "Lady Shri Ram College",
        degree: prof.deg,
        highestEducation: prof.high,
        currentCompany: i % 2 === 0 ? "Microsoft India" : "Boston Consulting Group",
        designation: prof.desig,
        industry: prof.ind,
        employmentType: "PRIVATE",
        annualIncome: prof.inc,
        incomeCurrency: "INR",
        religion: i % 9 === 0 ? "SIKH" : i % 7 === 0 ? "JAIN" : "HINDU",
        caste: "Voluntarily supplied",
        motherTongue,
        otherLanguages: JSON.stringify(["English", motherTongue !== "Hindi" ? "Hindi" : "Punjabi"]),
        familyType: i % 4 === 0 ? "JOINT" : "NUCLEAR",
        familyValues: i % 3 === 0 ? "LIBERAL" : "MODERATE",
        familyLocation: cityObj.city,
        fatherOccupation: "Professor / Academician",
        motherOccupation: "Medical Professional",
        siblingsCount: (i + 1) % 3,
        wantChildren: i % 8 === 0 ? "NO" : i % 6 === 0 ? "MAYBE" : "YES",
        openToRelocate: i % 2 === 0 ? "YES" : "MAYBE",
        openToPets: "YES",
        diet: i % 3 === 0 ? "VEGETARIAN" : i % 4 === 0 ? "EGGETARIAN" : "NON_VEGETARIAN",
        smoking: "NEVER",
        drinking: i % 3 === 0 ? "SOCIALLY" : "NEVER",
        hobbies: JSON.stringify(HOBBIES_LIST[(i + 2) % HOBBIES_LIST.length]),
        marriageTimeline: "6_TO_12_MONTHS",
        journeyStage: stage,
        profileCompleteness: 90 + (i % 10),
        assignedMatchmakerId: matchmakerUser.id,
        lastContactedAt: new Date(Date.now() - (i * 3 + 1) * 86400000),
        nextFollowUpDate: new Date(Date.now() + ((i % 4) - 1) * 86400000),
        internalNotes: "Articulate client. Seeking an intellectual equal who values mutual growth.",
        partnerPreference: {
          create: {
            minAge: age - 1,
            maxAge: age + 6,
            minHeightCm: 170,
            maxHeightCm: 190,
            preferredCities: JSON.stringify([cityObj.city, "Mumbai", "Bengaluru", "Delhi"]),
            preferredEducation: JSON.stringify(["MASTERS", "BACHELORS", "DOCTORATE"]),
            maritalStatusPreferences: JSON.stringify(["NEVER_MARRIED"]),
            wantChildrenPreference: "YES",
            dietPreferences: JSON.stringify(["VEGETARIAN", "EGGETARIAN", "NON_VEGETARIAN"]),
            dealbreakers: JSON.stringify(["MARITAL_STATUS", "CHILDREN"]),
          },
        },
      },
      include: { partnerPreference: true },
    });
    createdCustomers.push(profile);
  }

  console.log(`✅ Seeded ${createdCustomers.length} Diverse Fictional Profiles (62 Males, 63 Females).`);

  // 5. Seed Pre-Existing Interactions & Follow-Ups for Demo Focal Profiles
  const focalCustomer = createdCustomers[0]; // Rohan Sharma
  const focalFemale = createdCustomers[62];  // Ananya Deshmukh
  const candidateTwo = createdCustomers[63]; // Pooja Mehta
  const candidateThree = createdCustomers[64]; // Rhea Kapoor

  // Add notes
  await prisma.customerNote.create({
    data: {
      customerId: focalCustomer.id,
      authorId: matchmakerUser.id,
      noteType: "CALL_OUTCOME",
      content: "Conducted onboarding alignment call with Rohan. Clarified preference for Mumbai/Pune based candidates with tech/corporate background.",
    },
  });

  await prisma.customerNote.create({
    data: {
      customerId: focalCustomer.id,
      authorId: matchmakerUser.id,
      noteType: "MEETING_SUMMARY",
      content: "Client confirmed willingness to relocate within western India if partner is compatible.",
    },
  });

  // Add Follow-ups
  await prisma.followUp.create({
    data: {
      customerId: focalCustomer.id,
      matchmakerId: matchmakerUser.id,
      title: "Share Ananya Deshmukh profile packet with Rohan",
      description: "Follow up after client reviews verified credentials and introductory summary.",
      dueDate: new Date(Date.now() + 86400000 * 2),
      priority: "HIGH",
      status: "PENDING",
    },
  });

  await prisma.followUp.create({
    data: {
      customerId: focalFemale.id,
      matchmakerId: matchmakerUser.id,
      title: "Schedule intro call between matchmaker and candidate",
      description: "Discuss mutual timeline and verify preference flexibility.",
      dueDate: new Date(Date.now() - 86400000 * 1), // Overdue for demo
      priority: "URGENT",
      status: "PENDING",
    },
  });

  // Seed Sent Match Interaction with Status History
  const matchRec = await prisma.matchRecommendation.create({
    data: {
      customerId: focalCustomer.id,
      candidateId: candidateThree.id,
      compatibilityScore: 84.5,
      tier: "HIGH_POTENTIAL",
      scoreBreakdown: JSON.stringify({
        mutualPreference: 88,
        familyValues: 85,
        careerEducation: 80,
        locationRelocation: 100,
        lifestyleInterests: 85,
        ageHeight: 80,
      }),
      customerScoreAtoB: 86,
      candidateScoreBtoA: 83,
      sharedPreferences: JSON.stringify(["Mumbai based", "Vegetarian", "Corporate career"]),
      potentialConflicts: JSON.stringify(["None"]),
      missingAttributes: JSON.stringify([]),
      explanationText: "Strong mutual synergy across Mumbai metropolitan area with complementary corporate backgrounds.",
      status: "SENT",
    },
  });

  await prisma.matchInteraction.create({
    data: {
      matchRecommendationId: matchRec.id,
      customerAId: focalCustomer.id,
      customerBId: candidateThree.id,
      senderId: matchmakerUser.id,
      subject: `Curated Match Introduction: ${candidateThree.firstName} (${candidateThree.city})`,
      introductionMessage: `Dear Rohan, We are pleased to present Rhea's profile for your consideration. Rhea works in corporate consulting in Mumbai and shares your relationship vision.`,
      status: "SENT",
      statusHistory: JSON.stringify([
        { status: "SUGGESTED", timestamp: new Date(Date.now() - 86400000 * 4).toISOString(), note: "Algorithm identified 84.5% score" },
        { status: "APPROVED", timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), note: "Matchmaker approved presentation" },
        { status: "SENT", timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), note: "Introductory profile packet delivered to client" },
      ]),
    },
  });

  // Seed Activity Log records
  await prisma.activityLog.create({
    data: {
      customerId: focalCustomer.id,
      userId: matchmakerUser.id,
      actionType: "MATCH_SENT",
      title: "Match Introduction Dispatched",
      details: JSON.stringify({ candidate: candidateThree.firstName, candidateCode: candidateThree.customerCode }),
    },
  });

  await prisma.activityLog.create({
    data: {
      customerId: focalCustomer.id,
      userId: matchmakerUser.id,
      actionType: "NOTE_ADDED",
      title: "Preference Consultation Logged",
      details: "Client updated preferred relocation flexibility.",
    },
  });

  console.log("🎉 Seeding completed successfully! Database is fully populated.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
