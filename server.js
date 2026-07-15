import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const jsonServer = require('json-server');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom login endpoint
server.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const db = router.db;
  const user = db.get('users').find({ username, password }).value();
  
  if (user) {
    if (user.status === 'blocked') {
      return res.status(403).json({ success: false, message: 'Hesabınız bloke edilmiştir. Lütfen şubenizle görüşün.' });
    }
    // Generate a mock base64 token
    const token = btoa(JSON.stringify({ id: user.id, username: user.username, role: user.role }));
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        address: user.address,
        status: user.status
      }
    });
  } else {
    res.status(401).json({ success: false, message: 'Geçersiz kullanıcı adı veya şifre!' });
  }
});

// Custom register endpoint
server.post('/api/auth/register', (req, res) => {
  const { username, password, fullName, email, phoneNumber, address } = req.body;
  const db = router.db;
  
  const userExists = db.get('users').find({ username }).value();
  if (userExists) {
    return res.status(400).json({ success: false, message: 'Bu kullanıcı adı zaten alınmış!' });
  }
  
  const newUserId = String(Date.now());
  const newUser = {
    id: newUserId,
    username,
    password,
    fullName,
    email,
    role: 'customer',
    phoneNumber,
    address,
    status: 'active'
  };
  
  db.get('users').push(newUser).write();
  
  // Automatically initialize a TRY account for the new user
  const accountNoSuffix = String(Math.floor(1000 + Math.random() * 9000));
  const newAccount = {
    id: `acc-${Date.now()}`,
    userId: newUserId,
    accountNumber: `1000${accountNoSuffix}`,
    iban: `TR98 0006 2000 0000 1000 1000 ${accountNoSuffix}`,
    balance: 5000.00, // Gift 5000 TL for joining Astra Bank!
    currency: 'TRY',
    name: 'Vadesiz Mevduat',
    createdAt: new Date().toISOString()
  };
  db.get('accounts').push(newAccount).write();
  
  // Automatically initialize a Debit Card for the account
  const cardNo = `4355 8812 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`;
  const newCard = {
    id: `card-${Date.now()}`,
    userId: newUserId,
    accountId: newAccount.id,
    cardHolder: fullName.toUpperCase(),
    cardNumber: cardNo,
    expiryDate: '12/31',
    cvv: String(Math.floor(100 + Math.random() * 900)),
    type: 'debit',
    limit: 25000,
    usedLimit: 0,
    isFrozen: false,
    name: 'Astra Debit Card'
  };
  db.get('cards').push(newCard).write();

  // Create system log
  const newLog = {
    id: `log-${Date.now()}`,
    message: `${fullName} sisteme üye oldu ve hesapları tanımlandı.`,
    userId: newUserId,
    userRole: 'customer',
    date: new Date().toISOString()
  };
  db.get('systemLogs').push(newLog).write();
  
  res.json({ success: true, message: 'Kayıt başarıyla tamamlandı! Hediye 5.000 TL hesabınıza tanımlandı.' });
});

// Middleware to mock authentication parsing
server.use((req, res, next) => {
  if (req.headers.authorization) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const payload = JSON.parse(atob(token));
      req.user = payload;
    } catch (e) {
      // Ignore parsing errors
    }
  }
  next();
});

// Custom endpoint to patch singular systemSettings resource
server.patch('/systemSettings', (req, res) => {
  const db = router.db;
  const currentSettings = db.get('systemSettings').value() || {};
  const updatedSettings = { ...currentSettings, ...req.body };
  db.set('systemSettings', updatedSettings).write();
  res.json(updatedSettings);
});

server.use(router);

const PORT = 5001;
server.listen(PORT, () => {
  console.log(`Mock JSON Server is running on port ${PORT}`);
});
