// api/login.js
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { email, password } = JSON.parse(req.body);

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const usersFilePath = path.join(process.cwd(), 'users.json');
    const usersData = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
    const user = usersData.users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Password ko plain text mein compare kar rahe hain (warning: not recommended)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Login successful
    res.status(200).json({ message: 'Login successful!', user: { email: user.email } });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};