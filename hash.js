const bcrypt = require('bcryptjs');

async function generate() {
  const hash = await bcrypt.hash('siri123', 10);
  console.log('Hashed password:', hash);
}

generate();
