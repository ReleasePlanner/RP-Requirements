# 🚀 DEPLOYMENT - Ejecutar Ahora

## ⚡ Comando Rápido

**Ejecuta esto en tu terminal (reemplaza los valores):**

```bash
cd /c/MySources/RP-Requirements-Web/rp-workspace

VPS_HOST=TU_IP_AQUI VPS_USER=root GIT_REPO_URL=https://github.com/TU_USUARIO/TU_REPO.git ./scripts/deploy-requirements-vps.sh
```

---

## 📝 Paso a Paso

### 1. Abre tu terminal (Git Bash, PowerShell, o CMD)

### 2. Navega al proyecto

```bash
cd /c/MySources/RP-Requirements-Web/rp-workspace
```

### 3. Configura las variables (REEMPLAZA CON TUS VALORES):

```bash
# Reemplaza estos valores:
export VPS_HOST=185.123.45.67          # ← TU IP DEL VPS
export VPS_USER=root                    # ← Normalmente 'root'
export GIT_REPO_URL=https://github.com/tu-usuario/tu-repo.git  # ← TU REPO
```

### 4. Ejecuta el script

```bash
./scripts/deploy-requirements-vps.sh
```

---

## 🔍 Dónde Encontrar los Valores

### VPS_HOST (IP del VPS)
- Ve al panel de Hostinger
- Sección "VPS" → "IP Address"
- Copia la IP pública

### GIT_REPO_URL
- Ve a tu repositorio en GitHub
- Click en "Code" (botón verde)
- Copia la URL HTTPS

---

## ✅ Ejemplo Real

```bash
# Ejemplo con valores reales (NO USAR ESTOS, USA LOS TUYOS)
export VPS_HOST=185.123.45.67
export VPS_USER=root
export GIT_REPO_URL=https://github.com/mi-usuario/RP-Requirements-Web.git

./scripts/deploy-requirements-vps.sh
```

---

## 🚨 Si Tienes Problemas

Ver: [docs/CONFIGURAR_VARIABLES.md](docs/CONFIGURAR_VARIABLES.md)

---

**¡Ejecuta el comando y sigue las instrucciones del script!** 🚀

