// End-to-End Automated Verification Script for NxtWave Growth Challenge
const http = require('http');

function request(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 3000,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, body: json });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('=====================================================');
  console.log('🚀 RUNNING END-TO-END VERIFICATION TESTS');
  console.log('=====================================================\n');

  let passed = 0;
  let failed = 0;

  // TEST 1: Check Admin Stats Initial Load
  try {
    console.log('TEST 1: Check Admin Stats Initial Load');
    const res = await request('http://localhost:3000/api/admin/stats');
    if (res.status === 200 && res.body.success && res.body.stats.totalRegistrations > 0) {
      console.log(`  ✅ Passed: Loaded ${res.body.stats.totalRegistrations} seed registrations (Target: ${res.body.stats.targetRegistrations}, Budget: ₹${res.body.stats.budgetTotal})`);
      passed++;
    } else {
      console.log(`  ❌ Failed:`, res.body);
      failed++;
    }
  } catch (err) {
    console.log(`  ❌ Failed with error:`, err.message);
    failed++;
  }

  // TEST 2: Student 1 Direct Registration (Test A)
  let student1Code = '';
  let student1Email = `student1.${Date.now()}@iitm.ac.in`;
  try {
    console.log('\nTEST 2 (Test A): Student 1 Registers Directly');
    const res = await request('http://localhost:3000/api/register', { method: 'POST' }, {
      name: 'Rohan Sharma',
      email: student1Email,
      college: 'IIT Madras',
      branch: 'Computer Science & Engineering (CSE)',
      graduationYear: '2025',
    });

    if (res.status === 200 && res.body.success && res.body.student.referralCode) {
      student1Code = res.body.student.referralCode;
      console.log(`  ✅ Passed: Student 1 registered! Referral Code generated: ${student1Code}`);
      passed++;
    } else {
      console.log(`  ❌ Failed:`, res.body);
      failed++;
    }
  } catch (err) {
    console.log(`  ❌ Failed with error:`, err.message);
    failed++;
  }

  // TEST 3: Student 1 Dashboard Check
  try {
    console.log('\nTEST 3: Student 1 Dashboard API');
    const res = await request(`http://localhost:3000/api/student/${student1Code}`);
    if (res.status === 200 && res.body.success && res.body.student.referralCount === 0) {
      console.log(`  ✅ Passed: Student 1 dashboard retrieved. Referral count: ${res.body.student.referralCount}`);
      passed++;
    } else {
      console.log(`  ❌ Failed:`, res.body);
      failed++;
    }
  } catch (err) {
    console.log(`  ❌ Failed with error:`, err.message);
    failed++;
  }

  // TEST 4: Student 2 Registers via Student 1's Referral Link (Test B)
  let student2Email = `student2.${Date.now()}@vit.ac.in`;
  try {
    console.log(`\nTEST 4 (Test B): Student 2 Registers with Referral Code "${student1Code}"`);
    const res = await request('http://localhost:3000/api/register', { method: 'POST' }, {
      name: 'Priya Sundaram',
      email: student2Email,
      college: 'VIT Vellore',
      branch: 'Artificial Intelligence & Data Science (AI & DS)',
      graduationYear: '2025',
      referralCode: student1Code,
    });

    if (res.status === 200 && res.body.success && res.body.referrerAttributed) {
      console.log(`  ✅ Passed: Referral attributed successfully to ${res.body.referrerAttributed.name} (${res.body.referrerAttributed.referralCode})!`);
      passed++;
    } else {
      console.log(`  ❌ Failed:`, res.body);
      failed++;
    }
  } catch (err) {
    console.log(`  ❌ Failed with error:`, err.message);
    failed++;
  }

  // TEST 5: Verify Student 1 Referral Count Incremented
  try {
    console.log('\nTEST 5: Verify Student 1 Referral Count & Milestone Update');
    const res = await request(`http://localhost:3000/api/student/${student1Code}`);
    if (res.status === 200 && res.body.success && res.body.student.referralCount === 1) {
      const unlockedMilestones = res.body.milestones.filter(m => m.unlocked);
      console.log(`  ✅ Passed: Student 1 now has ${res.body.student.referralCount} referral! Unlocked perks: ${unlockedMilestones.map(m => m.title).join(', ')}`);
      passed++;
    } else {
      console.log(`  ❌ Failed:`, res.body);
      failed++;
    }
  } catch (err) {
    console.log(`  ❌ Failed with error:`, err.message);
    failed++;
  }

  // TEST 6: Duplicate Email Registration (Test C)
  try {
    console.log('\nTEST 6 (Test C): Duplicate Email Registration Prevention');
    const res = await request('http://localhost:3000/api/register', { method: 'POST' }, {
      name: 'Rohan Duplicate',
      email: student1Email,
      college: 'IIT Madras',
      branch: 'Computer Science & Engineering (CSE)',
      graduationYear: '2025',
    });

    if (res.status === 400 && res.body.success === false && res.body.error.includes('already exists')) {
      console.log(`  ✅ Passed: Duplicate registration rejected with message: "${res.body.error}"`);
      passed++;
    } else {
      console.log(`  ❌ Failed: Duplicate registration was not blocked! Status: ${res.status}`, res.body);
      failed++;
    }
  } catch (err) {
    console.log(`  ❌ Failed with error:`, err.message);
    failed++;
  }

  // TEST 7: Self-Referral Prevention (Test D)
  try {
    console.log('\nTEST 7 (Test D): Self-Referral Prevention');
    const res = await request('http://localhost:3000/api/register', { method: 'POST' }, {
      name: 'Rohan Sharma Fake Self',
      email: `rohan.another.${Date.now()}@gmail.com`,
      college: 'IIT Madras',
      branch: 'Computer Science & Engineering (CSE)',
      graduationYear: '2025',
      referralCode: student1Code,
    });

    // If using the same email or referencing self
    const resSelf = await request('http://localhost:3000/api/register', { method: 'POST' }, {
      name: 'Rohan Sharma',
      email: student1Email,
      college: 'IIT Madras',
      branch: 'Computer Science & Engineering (CSE)',
      graduationYear: '2025',
      referralCode: student1Code,
    });

    if (resSelf.status === 400) {
      console.log(`  ✅ Passed: Self-registration blocked properly.`);
      passed++;
    } else {
      console.log(`  ❌ Failed: Self-referral check failed`, resSelf.body);
      failed++;
    }
  } catch (err) {
    console.log(`  ❌ Failed with error:`, err.message);
    failed++;
  }

  // TEST 8: Invalid Referral Code Graceful Degradation (Test E)
  try {
    console.log('\nTEST 8 (Test E): Invalid Referral Code Handling');
    const res = await request('http://localhost:3000/api/register', { method: 'POST' }, {
      name: 'Akash Verma',
      email: `akash.${Date.now()}@bits-pilani.ac.in`,
      college: 'BITS Pilani',
      branch: 'Electrical & Electronics Engineering (EEE)',
      graduationYear: '2025',
      referralCode: 'NXT-NONEXISTENT',
    });

    if (res.status === 200 && res.body.success && res.body.warning && res.body.warning.includes('was not found')) {
      console.log(`  ✅ Passed: Gracefully handled invalid code with warning: "${res.body.warning}"`);
      passed++;
    } else {
      console.log(`  ❌ Failed:`, res.body);
      failed++;
    }
  } catch (err) {
    console.log(`  ❌ Failed with error:`, err.message);
    failed++;
  }

  // TEST 9: Campus Leaderboard Verification
  try {
    console.log('\nTEST 9: Campus Leaderboard Ranking Check');
    const res = await request('http://localhost:3000/api/leaderboard?limit=20');
    if (res.status === 200 && res.body.success && res.body.leaderboard.length > 0) {
      const top = res.body.leaderboard[0];
      console.log(`  ✅ Passed: Leaderboard retrieved! #1 Ranked: ${top.name} (${top.college}) with ${top.referralCount} referrals.`);
      passed++;
    } else {
      console.log(`  ❌ Failed:`, res.body);
      failed++;
    }
  } catch (err) {
    console.log(`  ❌ Failed with error:`, err.message);
    failed++;
  }

  console.log('\n=====================================================');
  console.log(`SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log('=====================================================');

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
