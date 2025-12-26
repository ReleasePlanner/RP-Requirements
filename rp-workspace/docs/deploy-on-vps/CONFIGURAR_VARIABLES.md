# ⚙️ Configurar Variables para Deployment

## 📝 Dónde Configurar las Variables

Las variables se configuran **ANTES** de ejecutar el script, directamente en tu terminal.

### Opción 1: Configurar en la misma línea del comando (Recomendado)

```bash
VPS_HOST=123.456.789.0 VPS_USER=root GIT_REPO_URL=https://github.com/tu-usuario/tu-repo.git ./scripts/deploy-requirements-vps.sh
```

**Reemplaza:**
- `123.456.789.0` → **Tu IP del VPS de Hostinger**
- `root` → **Tu usuario SSH** (normalmente `root`)
- `https://github.com/tu-usuario/tu-repo.git` → **URL de tu repositorio GitHub**

### Opción 2: Exportar variables antes del comando

```bash
# Configurar variables
export VPS_HOST=123.456.789.0
export VPS_USER=root
export GIT_REPO_URL=https://github.com/tu-usuario/tu-repo.git

# Ejecutar script
./scripts/deploy-requirements-vps.sh
```

### Opción 3: Crear archivo de configuración

```bash
# Crear archivo .env.deploy (no se sube a git)
cat > .env.deploy << EOF
VPS_HOST=123.456.789.0
VPS_USER=root
GIT_REPO_URL=https://github.com/tu-usuario/tu-repo.git
VPS_SSH_KEY=~/.ssh/id_rsa
EOF

# Cargar y ejecutar
source .env.deploy
./scripts/deploy-requirements-vps.sh
```

---

## 🔍 Cómo Obtener los Valores

### 1. VPS_HOST (IP del VPS)

**En el panel de Hostinger:**
- Ve a tu VPS
- Busca la sección "IP Address" o "Dirección IP"
- Copia la IP pública (ejemplo: `185.123.45.67`)

**O desde terminal:**
```bash
# Si ya tienes acceso SSH, puedes verificar:
ssh root@tu-vps-ip "hostname -I"
```

### 2. VPS_USER (Usuario SSH)

**Normalmente es:**
- `root` (usuario root)
- O el usuario que configuraste en Hostinger

**Verificar:**
```bash
# Probar conexión
ssh root@tu-vps-ip
# Si funciona, el usuario es 'root'
```

### 3. GIT_REPO_URL (URL del Repositorio)

**En GitHub:**
- Ve a tu repositorio
- Click en el botón verde "Code"
- Copia la URL HTTPS (ejemplo: `https://github.com/tu-usuario/RP-Requirements-Web.git`)

**O SSH (si tienes clave configurada):**
```bash
git@github.com:tu-usuario/RP-Requirements-Web.git
```

### 4. VPS_SSH_KEY (Opcional)

**Por defecto usa:** `~/.ssh/id_rsa`

**Si usas otra clave:**
```bash
export VPS_SSH_KEY=~/.ssh/otra_clave
```

**Verificar que existe:**
```bash
ls -la ~/.ssh/id_rsa
```

---

## 📋 Ejemplo Completo

### Ejemplo Real:

```bash
# Tu información (REEMPLAZA CON TUS VALORES REALES)
VPS_HOST=185.123.45.67
VPS_USER=root
GIT_REPO_URL=https://github.com/tu-usuario/RP-Requirements-Web.git

# Ejecutar deployment
VPS_HOST=185.123.45.67 VPS_USER=root GIT_REPO_URL=https://github.com/tu-usuario/RP-Requirements-Web.git ./scripts/deploy-requirements-vps.sh
```

---

## ✅ Verificación Antes de Ejecutar

Antes de ejecutar el script, verifica:

```bash
# 1. Verificar que puedes conectar al VPS
ssh root@TU_IP_AQUI

# 2. Verificar que el repositorio es accesible
git ls-remote https://github.com/tu-usuario/tu-repo.git

# 3. Verificar que el script existe y es ejecutable
ls -lh scripts/deploy-requirements-vps.sh
chmod +x scripts/deploy-requirements-vps.sh
```

---

## 🚨 Troubleshooting

### Error: "Variables requeridas no configuradas"

**Solución:** Asegúrate de configurar las variables antes de ejecutar:
```bash
export VPS_HOST=tu-ip
export VPS_USER=root
export GIT_REPO_URL=tu-repo-url
```

### Error: "No se puede conectar al VPS"

**Solución:** Verifica:
- IP correcta
- VPS encendido
- Firewall permite SSH (puerto 22)
- Clave SSH correcta

### Error: "Repositorio no accesible"

**Solución:**
- Si es privado, configura SSH key en el VPS
- Verifica la URL del repositorio
- Asegúrate de que el repositorio existe

---

## 📝 Resumen Rápido

**Comando completo (reemplaza los valores):**

```bash
VPS_HOST=TU_IP_AQUI VPS_USER=root GIT_REPO_URL=TU_REPO_AQUI ./scripts/deploy-requirements-vps.sh
```

**Donde:**
- `TU_IP_AQUI` = IP de tu VPS (ejemplo: `185.123.45.67`)
- `TU_REPO_AQUI` = URL de GitHub (ejemplo: `https://github.com/usuario/repo.git`)

---

**¡Listo!** Una vez configuradas las variables, ejecuta el script y sigue las instrucciones.

