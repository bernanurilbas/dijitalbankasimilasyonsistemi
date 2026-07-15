import axios from 'axios';

// Ensure localStorage DB is initialized from static /db.json
const ensureDb = async () => {
  if (typeof window !== 'undefined' && !localStorage.getItem('astra_db')) {
    try {
      const response = await fetch('/db.json');
      const data = await response.json();
      localStorage.setItem('astra_db', JSON.stringify(data));
    } catch (e) {
      console.error('Error fetching static db.json:', e);
      // Fallback fallback DB
      localStorage.setItem('astra_db', JSON.stringify({
        users: [],
        accounts: [],
        cards: [],
        systemLogs: [],
        supportTickets: [],
        bills: [],
        investments: [],
        systemSettings: {
          transferFeeTRY: 0,
          eftFeeTRY: 5,
          fastFeeTRY: 2,
          interestRateTRY: 45,
          maintenanceMode: false
        }
      }));
    }
  }
};

const getDb = () => {
  const dbStr = localStorage.getItem('astra_db');
  return JSON.parse(dbStr || '{}');
};

const saveDb = (db) => {
  localStorage.setItem('astra_db', JSON.stringify(db));
};

const api = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Custom adapter mimicking json-server and custom server.js endpoints
api.defaults.adapter = async (config) => {
  await ensureDb();
  const db = getDb();
  
  // Normalize request url and method
  let url = config.url || '';
  if (config.baseURL && url.startsWith(config.baseURL)) {
    url = url.slice(config.baseURL.length);
  }
  if (!url.startsWith('/')) url = '/' + url;
  
  const method = (config.method || 'get').toLowerCase();
  
  // Extract path and search params
  const [pathWithParams] = url.split('#');
  const [pathname, searchStr] = pathWithParams.split('?');
  
  const searchParams = new URLSearchParams(searchStr || '');
  const queryParams = {
    ...Object.fromEntries(searchParams.entries()),
    ...config.params
  };
  
  const data = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : (config.data || {});
  
  let responseData = null;
  let status = 200;
  
  // Route handling
  const parts = pathname.split('/').filter(Boolean);
  const resource = parts[0];
  const isAuth = resource === 'api' && parts[1] === 'auth';
  const subResource = isAuth ? parts[2] : parts[1];
  
  if (isAuth) {
    if (subResource === 'login' && method === 'post') {
      const { username, password } = data;
      const user = (db.users || []).find(u => u.username === username && u.password === password);
      
      if (user) {
        if (user.status === 'blocked') {
          status = 403;
          responseData = { success: false, message: 'Hesabınız bloke edilmiştir. Lütfen şubenizle görüşün.' };
        } else {
          const token = btoa(JSON.stringify({ id: user.id, username: user.username, role: user.role }));
          responseData = {
            success: true,
            token,
            user: { ...user }
          };
        }
      } else {
        status = 401;
        responseData = { success: false, message: 'Geçersiz kullanıcı adı veya şifre!' };
      }
    } else if (subResource === 'register' && method === 'post') {
      const { username, password, fullName, email, phoneNumber, address } = data;
      const userExists = (db.users || []).some(u => u.username === username);
      
      if (userExists) {
        status = 400;
        responseData = { success: false, message: 'Bu kullanıcı adı zaten alınmış!' };
      } else {
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
        if (!db.users) db.users = [];
        db.users.push(newUser);
        
        // Auto initialize a TRY account
        const accountNoSuffix = String(Math.floor(1000 + Math.random() * 9000));
        const newAccount = {
          id: `acc-${Date.now()}`,
          userId: newUserId,
          accountNumber: `1000${accountNoSuffix}`,
          iban: `TR98 0006 2000 0000 1000 1000 ${accountNoSuffix}`,
          balance: 5000.00,
          currency: 'TRY',
          name: 'Vadesiz Mevduat',
          createdAt: new Date().toISOString()
        };
        if (!db.accounts) db.accounts = [];
        db.accounts.push(newAccount);
        
        // Auto initialize a Debit Card
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
        if (!db.cards) db.cards = [];
        db.cards.push(newCard);
        
        // Create system audit log
        const newLog = {
          id: `log-${Date.now()}`,
          message: `${fullName} sisteme üye oldu ve hesapları tanımlandı.`,
          userId: newUserId,
          userRole: 'customer',
          date: new Date().toISOString()
        };
        if (!db.systemLogs) db.systemLogs = [];
        db.systemLogs.push(newLog);
        
        saveDb(db);
        responseData = { success: true, message: 'Kayıt başarıyla tamamlandı! Hediye 5.000 TL hesabınıza tanımlandı.' };
      }
    }
  } else if (resource === 'systemSettings') {
    if (method === 'get') {
      responseData = db.systemSettings || {};
    } else if (method === 'patch' || method === 'put') {
      db.systemSettings = { ...(db.systemSettings || {}), ...data };
      saveDb(db);
      responseData = db.systemSettings;
    }
  } else {
    const collectionName = resource;
    const id = parts[1];
    
    if (!db[collectionName]) db[collectionName] = [];
    
    if (id) {
      const index = db[collectionName].findIndex(item => String(item.id) === String(id));
      if (method === 'get') {
        if (index !== -1) {
          responseData = db[collectionName][index];
        } else {
          status = 404;
          responseData = 'Not Found';
        }
      } else if (method === 'patch' || method === 'put') {
        if (index !== -1) {
          db[collectionName][index] = { ...db[collectionName][index], ...data };
          saveDb(db);
          responseData = db[collectionName][index];
        } else {
          status = 404;
          responseData = 'Not Found';
        }
      } else if (method === 'delete') {
        if (index !== -1) {
          db[collectionName].splice(index, 1);
          saveDb(db);
          responseData = {};
        } else {
          status = 404;
          responseData = 'Not Found';
        }
      }
    } else {
      if (method === 'get') {
        let list = [...db[collectionName]];
        
        // Exact matching filters
        Object.keys(queryParams).forEach(key => {
          if (key === '_sort' || key === '_order' || key === '_limit' || key === '_page') return;
          const val = queryParams[key];
          list = list.filter(item => String(item[key]) === String(val));
        });
        
        // Sorting filter
        const sortKey = queryParams._sort;
        const sortOrder = queryParams._order || 'asc';
        if (sortKey) {
          list.sort((a, b) => {
            let valA = a[sortKey];
            let valB = b[sortKey];
            if (typeof valA === 'string') {
              return sortOrder === 'desc' ? valB.localeCompare(valA) : valA.localeCompare(valB);
            } else {
              return sortOrder === 'desc' ? valB - valA : valA - valB;
            }
          });
        }
        
        responseData = list;
      } else if (method === 'post') {
        const newItem = {
          id: data.id || `${collectionName.slice(0, 3)}-${Date.now()}`,
          ...data
        };
        db[collectionName].push(newItem);
        saveDb(db);
        responseData = newItem;
        status = 201;
      }
    }
  }
  
  if (status >= 200 && status < 300) {
    return {
      data: responseData,
      status: status,
      statusText: 'OK',
      headers: {},
      config: config
    };
  } else {
    const err = new Error(responseData?.message || 'API Error');
    err.response = {
      data: responseData,
      status: status,
      statusText: 'Error',
      headers: {},
      config: config
    };
    throw err;
  }
};

// Request interceptor to add authorization token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('astra_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.toString() || 'Bir hata oluştu. Lütfen tekrar deneyin.';
    
    // Auto logout on 401 Unauthorized
    if (error.response?.status === 401 && localStorage.getItem('astra_token')) {
      localStorage.removeItem('astra_token');
      localStorage.removeItem('astra_user');
      window.location.href = '/login';
    }
    
    return Promise.reject(message);
  }
);

export default api;
