# AI Dr. Malik Website

A professional website for Dr. Zubair Malik, MD, featuring:
- Consultation booking information
- AI-Dr. Malik chat interface for clinician education
- Privacy and Terms pages

## Project Structure

```
ai-channy-site/
├── frontend/
│   ├── index.html          # Main landing page
│   ├── ai.html             # AI chat interface (iframe)
│   ├── styles.css          # Styling
│   ├── app.js              # Frontend JavaScript
│   ├── privacy.html        # Privacy policy page
│   └── terms.html          # Terms of use page
├── backend/
│   ├── main.py             # FastAPI application
│   ├── models.py           # Pydantic models
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment variables template
└── README.md
```

## Backend Setup

1. **Create virtual environment:**
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

2. **Install dependencies:**
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

3. **Configure environment:**
```bash
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

4. **Run the server:**
```bash
uvicorn main:app --host 127.0.0.1 --port 5050 --reload
```

The API will be available at `http://127.0.0.1:5050`

## Frontend Setup

The frontend is static HTML/CSS/JS. Serve it using any static file server:

```bash
# Using Python
cd frontend
python3 -m http.server 8000

# Using Node.js
npx serve frontend

# Or deploy to Nginx (see deployment instructions below)
```

## Production Deployment

### Server Requirements
- Ubuntu/Debian server
- Python 3.8+
- Nginx
- SSL certificate (Let's Encrypt)

### Deployment Steps

1. **Install system packages:**
```bash
sudo apt update
sudo apt install -y nginx python3-venv python3-pip git ufw certbot python3-certbot-nginx
```

2. **Deploy backend:**
```bash
sudo mkdir -p /opt/ai-channy-site/backend
sudo chown -R $USER:$USER /opt/ai-channy-site
rsync -av ./backend/ /opt/ai-channy-site/backend/

cd /opt/ai-channy-site/backend
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

3. **Create systemd service:**
```bash
sudo tee /etc/systemd/system/ai-channy.service >/dev/null <<'EOF'
[Unit]
Description=AI Dr. Malik FastAPI
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/opt/ai-channy-site/backend
EnvironmentFile=/opt/ai-channy-site/backend/.env
ExecStart=/opt/ai-channy-site/backend/.venv/bin/uvicorn main:app --host 127.0.0.1 --port 5050 --workers 2
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now ai-channy
```

4. **Deploy frontend:**
```bash
sudo mkdir -p /var/www/ai-channy-site
sudo rsync -av ./frontend/ /var/www/ai-channy-site/
sudo chown -R www-data:www-data /var/www/ai-channy-site
```

5. **Configure Nginx:**
Create `/etc/nginx/sites-available/drmalik.ai` (see deployment instructions in main conversation)

6. **Set up SSL:**
```bash
sudo certbot --nginx -d drmalik.ai -d www.drmalik.ai
```

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `MODEL`: OpenAI model to use (default: `gpt-4o-mini`)
- `ALLOW_ORIGINS`: Comma-separated list of allowed CORS origins

## API Endpoints

- `GET /healthz`: Health check endpoint
- `POST /api/contact`: Submit contact form
- `POST /api/chat`: Chat with AI-Dr. Malik

## Notes

- The AI tool is designed for clinician education only
- Always review AI outputs with qualified healthcare professionals
- Not a substitute for professional medical advice
- Ensure HIPAA compliance if storing patient data

## License

Copyright © Dr. Zubair Malik / Innovators Generation

