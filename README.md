# Research-Project

This is the main repository for my final years of my masters course research project regarding the expansion and refresh of "AGRIDS"

## 🖥️ Running the Project<br/>

To run the project you need to setup the 3 parts:

1. Frontend
2. API
3. Orion

To begin, clone the repo onto your system:

```bash
git clone https://github.com/alexreynlds/Reseach-Project.git
cd agrids
```

### 🖥️ Running the frontend

To run the frontend of the AGRIDs project locally, follow these steps in a terminal instance:

#### 1. CD into the frontend folder

```bash
cd agrids/apps/frontend
```

#### 2. Create the environmental variables<br/>

Create a .env file and give it values such as:

```bash
NEXT_PUBLIC_ORION_BASE=http://localhost:1026/v2
NEXT_PUBLIC_API_BASE=http://localhost:5050
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1Ijoiam9uZGF2ZTI4OSIsImEiOiJjbHYyaW1rdjAwZmcwMnJwOGJpa3ZoaGpuIn0.2siN69K4PV8jgRZaIFlOjA
JWT_SECRET=change-this-to-a-long-random-value
```

#### 3. Install Dependencies

```bash
npm install
```

#### 4. Start the Development Server

```bash
npm run dev
```

Once the server is running, open your browser and go to:
http://localhost:3000

### 🖥️ Running the Backend<br/>

To run the backend of the AGRIDs project locally, follow these steps:

#### 1. Navigate to the Backend Directory

```bash
cd backend
```

#### 2. Create the environmental variables<br/>

Create a .env file and give it values such as:

```bash
FLASK_ENV=development
SECRET_KEY=change-this-to-a-long-random-value
JWT_ISSUER=agrids
JWT_COOKIE_NAME=session
JWT_ACCESS_TTL=1800
DATABASE=./agrids.sqlite
FIWARE_ORION_BASE_URL=http://localhost:1026/v2
FIWARE_SERVICE=agrids
FIWARE_SERVICE_PATH=/
```

#### 3. Create a virtual environment and connect to it

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
```

#### 4. Install Dependencies

```bash
pip -r requirements.txt
```

#### 5. Start the Backend Server

```bash
python wsgi.py
```

### 🖥️ Running Orion

To run a version of Orion locally, follow these steps in a terminal instance:<br/>
**ENSURE YOU HAVE DOCKER INSTALLED ON YOUR SYSTEM**

#### 1. CD into the orion/docker folder

```bash
cd agrids/apps/orion
```

#### 2. Install the docker instance

```bash
./services install
```

#### 3. Run the docker instance

```bash
./services start
```
