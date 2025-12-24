# 🔧 Instalar sshpass para Deployment Automático

El script de deployment necesita `sshpass` para automatizar la autenticación SSH con contraseña.

## 📦 Instalación de sshpass

### Windows (Git Bash)

**Opción 1: Usar WSL (Recomendado)**
```bash
# Instalar WSL si no lo tienes
wsl --install

# En WSL
sudo apt update
sudo apt install sshpass -y
```

**Opción 2: Descargar binario precompilado**
```bash
# Descargar desde: https://github.com/keimpx/sshpass-windows/releases
# Colocar en C:\Program Files\Git\usr\bin\
```

**Opción 3: Usar Chocolatey**
```bash
choco install sshpass
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install sshpass -y
```

### Mac
```bash
brew install hudochenkov/sshpass/sshpass
```

---

## ✅ Verificar Instalación

```bash
sshpass -V
```

Si muestra la versión, está instalado correctamente.

---

## 🚀 Después de Instalar sshpass

Ejecuta el deployment automático:

```bash
cd /c/MySources/RP-Requirements-Web/rp-workspace
./EJECUTAR_AUTOMATICO.sh
```

---

## 🔄 Alternativa: Deployment Manual

Si no puedes instalar sshpass, puedes ejecutar los pasos manualmente siguiendo:

**[docs/QUICK_START_VPS.md](docs/QUICK_START_VPS.md)**

El script te pedirá la contraseña (`Aar-Beto-2026`) cuando sea necesario.

---

## 📝 Comandos Manuales Rápidos

Si prefieres hacerlo manualmente, aquí están los comandos esenciales:

```bash
# 1. Conectar al VPS
ssh root@72.60.63.240
# Contraseña: Aar-Beto-2026

# 2. En el VPS, ejecutar setup
bash /tmp/quick-start-vps.sh
# O copiar el script primero:
# scp scripts/quick-start-vps.sh root@72.60.63.240:/tmp/

# 3. Clonar repositorio
cd /opt/modules
git clone https://github.com/ReleasePlanner/RP-Requirements.git requirements-management
cd requirements-management

# 4. Configurar .env
cp env.docker.example .env
nano .env
# Generar passwords:
# openssl rand -base64 32  # Para DB_PASSWORD
# openssl rand -base64 48  # Para JWT_SECRET

# 5. Build y deploy
cp docker-compose.prod.yml docker-compose.yml
docker-compose build
docker-compose up -d

# 6. Migraciones
sleep 60
docker-compose exec api npm run migration:run
```

---

**¿Prefieres instalar sshpass o hacer el deployment manualmente?**

