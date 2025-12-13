

# 💬 Real-Time Chat Application

## 🚀 Features
- ✨ **Real-time messaging** with WebSockets
- 👥 **User authentication** and profiles
- 🔔 **Online status** indicators
- 📁 **File sharing** capability
- 💾 **Message history** storage
- 🎨 **Modern responsive** UI

## 📋 Prerequisites
Before you begin, ensure you have installed:
- 🐍 **Python 3.8+**
- 📦 **Node.js 14+** and **npm**
- 🗄️ **SQLite3** (included with Python)

## ⚙️ Installation & Setup

### 🔧 Backend Setup (Django)
```bash
# 1. Clone the repository
git clone https://github.com/yourusername/Real-Time-Chat-Application.git
cd Real-Time-Chat-Application

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# 4. Install Python dependencies
pip install Django==5.1.7
pip install channels==4.3.2
pip install channels-redis==4.2.0
pip install daphne==4.1.3
pip install asgiref==3.8.1
pip install sqlparse==0.5.3

# 5. Apply migrations
cd chatsystemproj
python manage.py migrate

# 6. Create superuser (optional)
python manage.py createsuperuser
```

### 🎨 Frontend Setup (React)
```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install Node.js dependencies
npm install

# 3. Start development server
npm run dev
```

## 🚀 Running the Application

### Terminal 1: Start Django Channels Server (Daphne)
```bash
# Activate virtual environment first
venv\Scripts\activate

# Navigate to project directory
cd chatsystemproj

# Start Daphne server for WebSockets
daphne -p 8000 chatsystemproj.asgi:application
```

### Terminal 2: Start Django Development Server
```bash
# In another terminal, activate venv and run:
python manage.py runserver
```

### Terminal 3: Start Frontend Server
```bash
cd frontend
npm run dev
```

## 🔌 API Endpoints
- 🌐 **WebSocket:** `ws://localhost:8000/ws/chat/`
- 🔐 **Auth API:** `http://localhost:8000/api/auth/`
- 💬 **Chat API:** `http://localhost:8000/api/chat/`
- 👤 **Users API:** `http://localhost:8000/api/users/`

## 📁 Project Structure
```
Real-Time-Chat-Application/
├── chatsystemproj/          # Django Backend
│   ├── chatapp/            # Main chat application
│   ├── chatsystemproj/     # Project settings
│   ├── manage.py
│   └── db.sqlite3
├── frontend/               # React Frontend
│   ├── src/
│   ├── public/
│   └── package.json
└── README.md
```

## 🛠️ Technologies Used
- **Backend:** Django 4.x, Django Channels, Django REST Framework
- **Frontend:** React.js, Tailwind CSS, Axios
- **Database:** SQLite3
- **Real-time:** WebSockets, Redis (for production)
- **Authentication:** JWT Tokens

## 🌟 Environment Variables
Create a `.env` file in `chatsystemproj/`:
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

## 🐛 Troubleshooting
1. **Port already in use?** Change ports in settings
2. **WebSocket connection failed?** Ensure Daphne is running
3. **npm install errors?** Clear cache: `npm cache clean --force`
4. **Database issues?** Run: `python manage.py migrate --run-syncdb`

 
💻 **Happy Coding!** 🚀

---

Made with ❤️ by Muhammad Hashir
