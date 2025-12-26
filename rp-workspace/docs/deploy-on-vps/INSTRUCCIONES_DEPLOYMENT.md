# 🚀 Instrucciones para Ejecutar el Deployment

## ⚡ Comando para Ejecutar

**Abre tu terminal (Git Bash recomendado) y ejecuta:**

```bash
cd /c/MySources/RP-Requirements-Web/rp-workspace

export VPS_HOST=72.60.63.240
export VPS_USER=root
export GIT_REPO_URL=https://github.com/ReleasePlanner/RP-Requirements.git

./scripts/deploy-requirements-vps.sh
```

---

## 📋 Lo que Hará el Script

El script ejecutará automáticamente:

1. ✅ **Verificación SSH** - Comprueba que puedes conectar al VPS
2. ✅ **Setup Inicial** - Instala Docker, Docker Compose, Nginx, Certbot
3. ✅ **Clonar Repositorio** - Clona tu repo en `/opt/modules/requirements-management`
4. ⚠️ **Configurar .env** - Te pedirá que edites el archivo `.env` manualmente
5. ✅ **Build y Deploy** - Construye y despliega los contenedores
6. ✅ **Migraciones** - Ejecuta las migraciones de base de datos
7. ✅ **Verificación** - Verifica que todo funciona

---

## ⚠️ Puntos de Atención

### Cuando el script te pida configurar .env:

El script te conectará al VPS y te pedirá editar el archivo `.env`. 

**Valores críticos a configurar:**

```bash
# Conectarte al VPS
ssh root@72.60.63.240

# Editar .env
cd /opt/modules/requirements-management
nano .env
```

**Generar passwords seguros:**

```bash
# Password para base de datos
openssl rand -base64 32

# JWT Secret (mínimo 32 caracteres)
openssl rand -base64 48
```

**Valores mínimos a cambiar en .env:**

```env
DB_PASSWORD=<genera-con-openssl-rand-base64-32>
JWT_SECRET=<genera-con-openssl-rand-base64-48>
CORS_ORIGIN=https://requirements.beyondnet.cloud
NEXT_PUBLIC_API_URL=https://requirements-api.beyondnet.cloud/api/v1
```

---

## 🔍 Verificación Durante el Proceso

### Ver logs en tiempo real:

```bash
# En otra terminal, conectarte al VPS
ssh root@72.60.63.240
cd /opt/modules/requirements-management
docker-compose logs -f
```

### Ver estado de contenedores:

```bash
docker-compose ps
```

---

## ✅ Después del Deployment

Una vez completado el deployment:

1. **Configurar DNS** (si aún no lo hiciste):
   - `requirements.beyondnet.cloud` → `72.60.63.240`
   - `requirements-api.beyondnet.cloud` → `72.60.63.240`

2. **Configurar Nginx y SSL**:
   ```bash
   ssh root@72.60.63.240
   # Seguir instrucciones en docs/QUICK_START_VPS.md - Paso 5
   ```

3. **Verificar acceso**:
   - Portal: `https://requirements.beyondnet.cloud`
   - API: `https://requirements-api.beyondnet.cloud/api/v1/health/liveness`

---

## 🚨 Si Algo Sale Mal

### Ver logs del script:
El script mostrará errores en pantalla. Lee los mensajes cuidadosamente.

### Ver logs de contenedores:
```bash
ssh root@72.60.63.240
cd /opt/modules/requirements-management
docker-compose logs
```

### Reiniciar desde cero:
```bash
ssh root@72.60.63.240
cd /opt/modules/requirements-management
docker-compose down
docker-compose build
docker-compose up -d
```

---

## 📞 Siguiente Paso

**Ejecuta el comando ahora en tu terminal:**

```bash
cd /c/MySources/RP-Requirements-Web/rp-workspace
export VPS_HOST=72.60.63.240
export VPS_USER=root
export GIT_REPO_URL=https://github.com/ReleasePlanner/RP-Requirements.git
./scripts/deploy-requirements-vps.sh
```

El script te guiará paso a paso. Cuando te pida confirmación, responde `y` (yes).

---

**¡Listo para ejecutar!** 🚀

