const bcrypt = require('bcryptjs');

async function generate() {
  const hash = await bcrypt.hash('ayesha1234', 10);
  console.log('Hashed password:', hash);
}

generate();
