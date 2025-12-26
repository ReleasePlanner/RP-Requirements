# 🔐 Configuración SSH para Deployment

## Opción 1: Usar Contraseña SSH (Interactivo)

Si tu VPS usa autenticación por contraseña, el script te pedirá la contraseña cuando sea necesario.

**Ejecutar:**
```bash
cd /c/MySources/RP-Requirements-Web/rp-workspace
export VPS_HOST=72.60.63.240
export VPS_USER=root
export GIT_REPO_URL=https://github.com/ReleasePlanner/RP-Requirements.git
./scripts/deploy-requirements-vps.sh
```

Cuando el script pida la contraseña SSH, ingresa: `Aar-Beto-2026`

---

## Opción 2: Configurar Clave SSH (Recomendado)

Para evitar ingresar la contraseña cada vez, configura una clave SSH:

### Paso 1: Generar clave SSH (si no tienes una)

```bash
ssh-keygen -t rsa -b 4096 -C "tu-email@ejemplo.com"
# Presiona Enter para usar ubicación por defecto
# Opcional: Ingresa una passphrase o presiona Enter para no usar
```

### Paso 2: Copiar clave pública al VPS

```bash
# Opción A: Usando ssh-copy-id (si está disponible)
ssh-copy-id root@72.60.63.240

# Opción B: Manualmente
cat ~/.ssh/id_rsa.pub | ssh root@72.60.63.240 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

Cuando pida la contraseña, ingresa: `Aar-Beto-2026`

### Paso 3: Verificar que funciona sin contraseña

```bash
ssh root@72.60.63.240
# Debería conectar sin pedir contraseña
```

---

## Opción 3: Usar sshpass (Automático)

Si prefieres automatizar completamente, puedes usar `sshpass`:

### Instalar sshpass

**En Windows (Git Bash):**
```bash
# Descargar sshpass para Windows o usar WSL
```

**En Linux/Mac:**
```bash
sudo apt install sshpass  # Ubuntu/Debian
brew install sshpass      # Mac
```

### Modificar script para usar sshpass

El script actual usa claves SSH. Para usar contraseña con sshpass, puedes modificar temporalmente:

```bash
# En lugar de:
ssh -i "$VPS_SSH_KEY" "$VPS_USER@$VPS_HOST" "comando"

# Usar:
sshpass -p 'Aar-Beto-2026' ssh "$VPS_USER@$VPS_HOST" "comando"
```

---

## ⚠️ Seguridad

**IMPORTANTE:**
- ❌ NO guardes contraseñas en archivos del proyecto
- ❌ NO subas contraseñas a Git
- ✅ Usa claves SSH cuando sea posible
- ✅ Si usas contraseña, ingrésala manualmente cuando se solicite

---

## 🚀 Deployment con Contraseña

**Ejecutar deployment (te pedirá la contraseña cuando sea necesario):**

```bash
cd /c/MySources/RP-Requirements-Web/rp-workspace
export VPS_HOST=72.60.63.240
export VPS_USER=root
export GIT_REPO_URL=https://github.com/ReleasePlanner/RP-Requirements.git
./scripts/deploy-requirements-vps.sh
```

Cuando el script intente conectar vía SSH y pida la contraseña, ingresa: `Aar-Beto-2026`

---

## 📝 Nota sobre el Script Actual

El script actual (`deploy-requirements-vps.sh`) está configurado para usar claves SSH (`~/.ssh/id_rsa`). 

Si tu VPS solo acepta contraseña (no clave SSH), el script fallará en la verificación SSH. En ese caso:

1. **Configura clave SSH** (Opción 2 arriba) - Recomendado
2. **O modifica el script** para usar contraseña interactiva
3. **O ejecuta los pasos manualmente** siguiendo `docs/QUICK_START_VPS.md`

---

**¿Necesitas ayuda configurando la clave SSH?** Puedo guiarte paso a paso.

