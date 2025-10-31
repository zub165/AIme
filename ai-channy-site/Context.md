# Context.md - AI Dr. Malik Website

## Project Overview

This is a professional medical consultation website for **Dr. Zubair Malik, MD**, featuring an AI-powered chatbot designed for clinician education in **Nephrology and Internal Medicine**. The site provides consultation booking information, educational resources, and an AI copilot that assists clinicians with evidence-based medical guidance.

### Key Features

- **Professional Landing Page**: Showcases consultation services, credentials, and contact information
- **AI-Dr. Malik Chat Interface**: Clinician-facing AI copilot trained on KDIGO/KDOQI guidelines and medical best practices
- **Consultation Booking**: Information about nephrology and internal medicine consultations
- **Contact Form**: Direct communication channel for inquiries
- **Legal Compliance**: Privacy policy and terms of use pages

### Target Audience

- Healthcare professionals (physicians, nurse practitioners, physician assistants)
- Clinicians seeking nephrology/internal medicine guidance
- Medical students and residents

---

## Architecture

### Technology Stack

#### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript**: No frameworks - lightweight and fast
- **Responsive Design**: Mobile-first approach

#### Backend
- **FastAPI**: Modern Python web framework
- **Python 3.8+**: Backend runtime
- **Uvicorn**: ASGI server
- **OpenAI API**: GPT-4o-mini for AI chat functionality
- **Pydantic**: Data validation

#### Infrastructure
- **Nginx**: Reverse proxy and static file server
- **systemd**: Process management
- **Let's Encrypt**: SSL/TLS certificates
- **Linux/Ubuntu**: Recommended server OS

### Project Structure

```
ai-channy-site/
├── frontend/
│   ├── index.html          # Main landing page
│   ├── ai.html             # Standalone AI chat interface
│   ├── styles.css          # All styling
│   ├── app.js              # Frontend JavaScript (modals, forms)
│   ├── privacy.html        # Privacy policy page
│   └── terms.html          # Terms of use page
├── backend/
│   ├── main.py             # FastAPI application entry point
│   ├── models.py           # Pydantic data models
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment variables template
├── README.md               # Quick start guide
└── Context.md              # This file - comprehensive documentation
```

---

## Development Setup

### Prerequisites

- **Python 3.8+** installed
- **Node.js** (optional, for alternative frontend serving)
- **Git** for version control
- **OpenAI API Key** for AI functionality

### Local Development

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd ai-channy-site
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv .venv

# Activate virtual environment
# On macOS/Linux:
source .venv/bin/activate
# On Windows:
# .venv\Scripts\activate

# Upgrade pip
pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt
```

#### 3. Environment Configuration

```bash
# Copy example environment file
cp .env.example .env

# Edit .env file with your credentials
nano .env  # or use your preferred editor
```

Required environment variables:
```env
OPENAI_API_KEY=sk-your-api-key-here
MODEL=gpt-4o-mini
ALLOW_ORIGINS=http://localhost:8000,http://127.0.0.1:8000
```

#### 4. Start Backend Server

```bash
# Make sure virtual environment is activated
uvicorn main:app --host 127.0.0.1 --port 5050 --reload
```

The API will be available at:
- **API Docs**: http://127.0.0.1:5050/docs
- **Health Check**: http://127.0.0.1:5050/healthz

#### 5. Start Frontend Server

In a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Option 1: Python HTTP Server
python3 -m http.server 8000

# Option 2: Node.js (if you have it installed)
npx serve . -p 8000

# Option 3: PHP (if installed)
php -S localhost:8000
```

The frontend will be available at: **http://localhost:8000**

---

## Building the Application

### Frontend Build Process

The frontend is **static HTML/CSS/JS** - no build step required! However, you can:

#### Optimize for Production

1. **Minify CSS/JS** (optional):
```bash
# Install minification tools
npm install -g clean-css-cli terser

# Minify CSS
cleancss -o styles.min.css styles.css

# Minify JS
terser app.js -o app.min.js
```

2. **Optimize Images**:
   - Use WebP format
   - Compress images before uploading
   - Update `index.html` with optimized image paths

3. **Add Service Worker** (optional, for offline support)

### Backend Build Process

The backend doesn't require compilation, but you should:

1. **Freeze Dependencies**:
```bash
pip freeze > requirements.txt
```

2. **Test Production Configuration**:
```bash
# Test with production settings
uvicorn main:app --host 0.0.0.0 --port 5050 --workers 2
```

---

## API Documentation

### Base URL

- **Local**: `http://127.0.0.1:5050`
- **Production**: `https://your-domain.com`

### Endpoints

#### 1. Health Check

```http
GET /healthz
```

**Response:**
```json
{
  "ok": true,
  "time": "2024-01-15T10:30:00.000000"
}
```

#### 2. Contact Form Submission

```http
POST /api/contact
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I have a question about..."
}
```

**Response:**
```json
{
  "ok": true
}
```

#### 3. AI Chat

```http
POST /api/chat
Content-Type: application/json
```

**Request Body:**
```json
{
  "turns": [
    {
      "role": "user",
      "content": "What is the renal dosing for metformin?"
    }
  ]
}
```

**Response:**
```json
{
  "reply": "Based on KDIGO guidelines...",
  "citations": []
}
```

**Multi-turn Conversation:**
```json
{
  "turns": [
    {"role": "user", "content": "Patient with CKD stage 3a"},
    {"role": "assistant", "content": "To provide guidance..."},
    {"role": "user", "content": "Creatinine 2.1, eGFR 32"}
  ]
}
```

---

## Production Deployment

### Server Requirements

- **OS**: Ubuntu 20.04+ or Debian 11+
- **RAM**: 1GB minimum (2GB recommended)
- **CPU**: 1 core minimum
- **Storage**: 10GB minimum
- **Network**: Public IP with domain name configured

### Step-by-Step Deployment

#### 1. Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y nginx python3-venv python3-pip git ufw certbot python3-certbot-nginx
```

#### 2. Firewall Configuration

```bash
# Allow SSH (important - do this first!)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'

# Enable firewall
sudo ufw enable

# Verify status
sudo ufw status
```

#### 3. Backend Deployment

```bash
# Create application directory
sudo mkdir -p /opt/ai-channy-site/backend
sudo chown -R $USER:$USER /opt/ai-channy-site

# Upload backend files (from your local machine)
# Option 1: Using rsync (if server is accessible)
rsync -av ./backend/ user@your-server:/opt/ai-channy-site/backend/

# Option 2: Using git (recommended)
cd /opt/ai-channy-site
git clone <your-repo-url> .
cd backend

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Create and configure .env file
cp .env.example .env
nano .env  # Add your OpenAI API key and configuration

# Secure .env file
chmod 600 .env
```

#### 4. Create Systemd Service

```bash
sudo nano /etc/systemd/system/ai-channy.service
```

Add the following configuration:

```ini
[Unit]
Description=AI Dr. Malik FastAPI Backend
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/opt/ai-channy-site/backend
EnvironmentFile=/opt/ai-channy-site/backend/.env
ExecStart=/opt/ai-channy-site/backend/.venv/bin/uvicorn main:app --host 127.0.0.1 --port 5050 --workers 2
Restart=always
RestartSec=3
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable ai-channy
sudo systemctl start ai-channy
sudo systemctl status ai-channy
```

#### 5. Frontend Deployment

```bash
# Create web directory
sudo mkdir -p /var/www/ai-channy-site

# Upload frontend files
# Option 1: Using rsync
rsync -av ./frontend/ user@your-server:/var/www/ai-channy-site/

# Option 2: Using git
cd /opt/ai-channy-site
sudo cp -r frontend/* /var/www/ai-channy-site/

# Set proper permissions
sudo chown -R www-data:www-data /var/www/ai-channy-site
sudo chmod -R 755 /var/www/ai-channy-site
```

#### 6. Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/drmalik.ai
```

Add the following configuration:

```nginx
# Rate limiting (add to http {} block in /etc/nginx/nginx.conf if not present)
# limit_req_zone $binary_remote_addr zone=api_zone:10m rate=10r/s;

server {
    listen 80;
    server_name drmalik.ai www.drmalik.ai;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), camera=(), microphone=()" always;

    # Client settings
    client_max_body_size 5m;
    client_body_timeout 10s;
    client_header_timeout 10s;

    # Serve static files
    root /var/www/ai-channy-site;
    index index.html;

    # API reverse proxy with rate limiting
    location /api/ {
        limit_req zone=api_zone burst=20 nodelay;
        proxy_pass http://127.0.0.1:5050/api/;
        proxy_http_version 1.1;
        proxy_read_timeout 120s;
        proxy_connect_timeout 10s;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Connection "";
    }

    # Health check endpoint
    location /healthz {
        proxy_pass http://127.0.0.1:5050/healthz;
        access_log off;
    }

    # Static files
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/drmalik.ai /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl reload nginx
```

#### 7. SSL Certificate (Let's Encrypt)

```bash
# Request SSL certificate
sudo certbot --nginx -d drmalik.ai -d www.drmalik.ai

# Test auto-renewal
sudo certbot renew --dry-run

# Certbot will automatically update Nginx configuration
```

#### 8. Verify Deployment

1. **Check Backend Service**:
```bash
sudo systemctl status ai-channy
curl http://127.0.0.1:5050/healthz
```

2. **Check Nginx**:
```bash
sudo systemctl status nginx
curl -I http://your-domain.com
```

3. **Test Website**:
   - Visit `https://your-domain.com`
   - Test contact form
   - Test AI chat interface

---

## Configuration Details

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `OPENAI_API_KEY` | OpenAI API key for AI chat | - | Yes |
| `MODEL` | OpenAI model to use | `gpt-4o-mini` | No |
| `ALLOW_ORIGINS` | Comma-separated CORS origins | `*` | No |

### AI System Prompt

The AI is configured with a specialized system prompt that:
- Identifies as "AI Dr. Malik (Nephrology & Internal Medicine)"
- Includes medical guardrails and disclaimers
- Requires specific data before providing dosing advice
- Detects red flags (hyperkalemia, pulmonary edema, etc.)
- References KDIGO/KDOQI and other major guidelines
- Provides structured responses with citations

### Port Configuration

- **Backend**: Port `5050` (internal, not exposed)
- **Frontend**: Port `80/443` (via Nginx)
- **Health Check**: Available at `/healthz`

---

## Development Workflow

### Making Changes

1. **Frontend Changes**:
   ```bash
   # Edit files in frontend/
   cd frontend
   # Make your changes
   # Test locally at http://localhost:8000
   ```

2. **Backend Changes**:
   ```bash
   # Edit files in backend/
   cd backend
   source .venv/bin/activate
   # Make your changes
   # Server auto-reloads with --reload flag
   ```

### Testing

#### Manual Testing Checklist

- [ ] Landing page loads correctly
- [ ] All navigation links work
- [ ] Contact form submits successfully
- [ ] AI chat modal opens/closes
- [ ] AI chat sends and receives messages
- [ ] Privacy and Terms pages accessible
- [ ] Responsive design works on mobile
- [ ] All images load correctly

#### API Testing

```bash
# Test health endpoint
curl http://localhost:5050/healthz

# Test contact endpoint
curl -X POST http://localhost:5050/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Test message"}'

# Test chat endpoint
curl -X POST http://localhost:5050/api/chat \
  -H "Content-Type: application/json" \
  -d '{"turns":[{"role":"user","content":"Hello"}]}'
```

### Version Control

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: AI Dr. Malik website"

# Add remote
git remote add origin <repository-url>

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Troubleshooting

### Backend Issues

**Service won't start:**
```bash
# Check logs
sudo journalctl -u ai-channy -n 50

# Verify environment file
sudo cat /opt/ai-channy-site/backend/.env

# Check port availability
sudo lsof -i :5050
```

**Import errors:**
```bash
# Reinstall dependencies
cd /opt/ai-channy-site/backend
source .venv/bin/activate
pip install -r requirements.txt --force-reinstall
```

### Frontend Issues

**404 errors:**
- Verify Nginx configuration
- Check file permissions
- Ensure files are in correct directory

**API calls failing:**
- Check CORS configuration in backend
- Verify ALLOW_ORIGINS includes your domain
- Check browser console for errors

### Nginx Issues

**Configuration errors:**
```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log
```

**502 Bad Gateway:**
- Backend service not running
- Wrong port in proxy_pass
- Firewall blocking localhost

---

## Security Considerations

### Production Checklist

- [ ] Use HTTPS only (SSL certificate configured)
- [ ] Secure `.env` file (chmod 600)
- [ ] Limit CORS origins (don't use `*` in production)
- [ ] Enable rate limiting on API endpoints
- [ ] Keep system packages updated
- [ ] Use strong passwords for server access
- [ ] Configure firewall properly
- [ ] Regular backups of configuration
- [ ] Monitor logs for suspicious activity

### HIPAA Compliance (If Applicable)

If storing patient data:
- [ ] Encrypt data at rest
- [ ] Use encrypted connections (HTTPS)
- [ ] Implement access controls
- [ ] Maintain audit logs
- [ ] Sign Business Associate Agreements with vendors
- [ ] Regular security assessments

---

## Future Enhancements

### Potential Features

1. **Database Integration**:
   - Store chat history
   - Save contact form submissions
   - User authentication for clinicians

2. **Enhanced AI Features**:
   - RAG (Retrieval-Augmented Generation) with medical guidelines
   - Calculator APIs (eGFR, ACR, anion gap, etc.)
   - Image analysis for medical scans

3. **Booking Integration**:
   - Calendly integration
   - Stripe payment processing
   - Email notifications

4. **Analytics**:
   - Usage tracking
   - Popular queries
   - Performance metrics

5. **Mobile App**:
   - React Native or Flutter app
   - Push notifications
   - Offline mode

---

## Contributing

### Guidelines

1. Follow existing code style
2. Test changes locally before committing
3. Update documentation if adding features
4. Use descriptive commit messages
5. Create pull requests for major changes

### Code Style

- **Python**: Follow PEP 8
- **JavaScript**: Use modern ES6+ syntax
- **HTML**: Semantic markup
- **CSS**: Use consistent naming (BEM methodology recommended)

---

## License

Copyright © 2024 Dr. Zubair Malik / Innovators Generation

All rights reserved. This project is proprietary software.

---

## Support

For issues, questions, or contributions:
- **Email**: Use the contact form on the website
- **GitHub**: Open an issue in the repository
- **Documentation**: Refer to this Context.md file

---

## Quick Reference

### Common Commands

```bash
# Backend - Start
cd backend && source .venv/bin/activate
uvicorn main:app --host 127.0.0.1 --port 5050 --reload

# Backend - Restart (production)
sudo systemctl restart ai-channy

# Frontend - Start
cd frontend && python3 -m http.server 8000

# Nginx - Reload
sudo systemctl reload nginx

# Nginx - Test config
sudo nginx -t

# View logs
sudo journalctl -u ai-channy -f
sudo tail -f /var/log/nginx/error.log
```

### Important Files

- `.env`: Environment configuration (keep secret!)
- `main.py`: Backend application entry point
- `index.html`: Main landing page
- `ai.html`: AI chat interface
- `/etc/nginx/sites-available/drmalik.ai`: Nginx configuration
- `/etc/systemd/system/ai-channy.service`: Systemd service file

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Maintainer**: Dr. Zubair Malik

