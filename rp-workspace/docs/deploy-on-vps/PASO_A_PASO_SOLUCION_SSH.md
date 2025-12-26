# 🔧 Solución Paso a Paso: Permission Denied SSH

## 🎯 Objetivo

Solucionar el error `Permission denied (publickey,password)` paso a paso, verificando cada punto.

---

## 📋 Checklist de Verificación

Sigue estos pasos en orden y marca cada uno cuando lo completes:

                                                                                                                                                                                                                                                                                                                                                                                                          - [ ] **Paso 1**: Verificar que tienes acceso al VPS
                                                                                                                                                                                                                                                                                                                                                                                                          - [ ] **Paso 2**: Ejecutar diagnóstico en el VPS

- [ ] **Paso 3**: Obtener tu clave pública SSH
- [ ] **Paso 4**: Agregar clave pública al VPS
- [ ] **Paso 5**: Verificar permisos
- [ ] **Paso 6**: Probar conexión manual
- [ ] **Paso 7**: Verificar GitHub Secret
- [ ] **Paso 8**: Probar en GitHub Actions

---

**¿Cómo puedes conectarte al VPS actualmente?**

- [ ] **Opción A**: Tengo acceso SSH con contraseña
- [ ] **Opción B**: Tengo acceso por panel de Hostinger (terminal web)
- [ ] **Opción C**: Tengo otra clave SSH que funciona
- [ ] **Opción D**: No tengo acceso directo

**Si no tienes acceso**, necesitas:

1. Contactar a Hostinger para obtener acceso
2. O usar el panel de Hostinger para acceder al terminal web

---

## 🔍 Paso 2: Ejecutar Diagnóstico en el VPS

**Conéctate al VPS** usando cualquiera de los métodos del Paso 1.

**Luego ejecuta el script de diagnóstico:**

```bash
# Opción A: Si puedes copiar archivos al VPS
# Copia el contenido de rp-workspace/deploy-on-vps/diagnostico-ssh.sh
# Luego ejecuta:
chmod +x diagnostico-ssh.sh
bash diagnostico-ssh.sh

# Opción B: Ejecutar comandos manualmente
mkdir -p ~/.ssh
chmod 700 ~/.ssh
ls -la ~/.ssh
```

**El diagnóstico mostrará:**

- ✅ Qué está bien configurado
- ❌ Qué necesita corrección
- ⚠️ Advertencias y recomendaciones

---

## 🔑 Paso 3: Obtener tu Clave Pública SSH

**Tienes dos opciones:**

### Opción A: Si ya tienes la clave privada en GitHub Secrets

1. Ve a: `Settings > Secrets and variables > Actions`
2. Abre `VPS_SSH_KEY`
3. Copia el contenido completo
4. Guárdalo temporalmente en un archivo local: `github_key`
5. **Genera la clave pública desde la privada:**

```bash
# En tu máquina local
ssh-keygen -y -f github_key > github_key.pub
cat github_key.pub
```

**⚠️ Importante**: La clave debe tener formato correcto (BEGIN/END)

### Opción B: Generar una Nueva Clave SSH

```bash
# En tu máquina local
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy

# Mostrar la clave pública
cat ~/.ssh/github_actions_deploy.pub
```

**Copia la clave pública completa** (debe empezar con `ssh-ed25519` o `ssh-rsa`)

---

## 📝 Paso 4: Agregar Clave Pública al VPS

**Conéctate al VPS** (usando el método del Paso 1)

### Si tienes acceso SSH con contraseña (Más Fácil)

```bash
# Desde tu máquina local
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub root@TU_VPS_IP

# Esto automáticamente:
# - Crea ~/.ssh si no existe
# - Agrega la clave a authorized_keys
# - Configura los permisos correctos
```

### Si NO tienes acceso SSH con contraseña (Manual)

**En el VPS, ejecuta:**

```bash
# 1. Crear directorio si no existe
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# 2. Crear archivo authorized_keys si no existe
touch ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# 3. Agregar tu clave pública (reemplaza con TU_CLAVE_PUBLICA del Paso 3)
echo "TU_CLAVE_PUBLICA_COMPLETA_AQUI" >> ~/.ssh/authorized_keys

# 4. Verificar que se agregó correctamente
cat ~/.ssh/authorized_keys

# Deberías ver tu clave pública en el archivo
```

**⚠️ Importante**:

- Reemplaza `TU_CLAVE_PUBLICA_COMPLETA_AQUI` con la clave pública del Paso 3
- Debe ser UNA línea completa
- No agregues saltos de línea
- No agregues espacios extra

---

## 🔒 Paso 5: Verificar Permisos

**En el VPS, ejecuta:**

```bash
# Verificar permisos actuales
ls -la ~/.ssh/

# Debe mostrar:
# drwx------  .ssh (700)
# -rw-------  authorized_keys (600)

# Si no están correctos, corregir:
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys

# Verificar propiedad (debe ser tu usuario)
stat -c "%U %G" ~/.ssh
stat -c "%U %G" ~/.ssh/authorized_keys

# Si la propiedad está mal, corregir:
chown -R $(whoami):$(whoami) ~/.ssh
```

**Verificación final:**

```bash
# Ejecutar diagnóstico nuevamente
bash diagnostico-ssh.sh

# Deberías ver:
# ✅ Directorio existe
# ✅ Permisos correctos (700)
# ✅ Archivo existe
# ✅ Permisos correctos (600)
# ✅ Número de claves autorizadas: 1 (o más)
```

---

## 🧪 Paso 6: Probar Conexión Manual

**Desde tu máquina local:**

```bash
# Probar conexión con la clave SSH
ssh -i ~/.ssh/github_actions_deploy root@TU_VPS_IP

# O si usaste otra ruta:
ssh -i /ruta/a/tu/clave root@TU_VPS_IP
```

**Resultados esperados:**

- ✅ **Si funciona sin pedir contraseña**: ¡Perfecto! La configuración está correcta
- ❌ **Si pide contraseña**: La clave no está autorizada, revisa el Paso 4
- ❌ **Si dice "Permission denied"**: Revisa permisos en el Paso 5

**Si funciona**, continúa al Paso 7.

**Si NO funciona**, revisa:

1. ¿La clave pública está en `authorized_keys`? (`cat ~/.ssh/authorized_keys` en el VPS)
2. ¿Los permisos son correctos? (`ls -la ~/.ssh/` en el VPS)
3. ¿El usuario es correcto? (debe ser el mismo que `VPS_USER` en GitHub Secrets)

---

## 🔐 Paso 7: Verificar GitHub Secret

**En GitHub:**

1. Ve a: `Settings > Secrets and variables > Actions`
2. Abre `VPS_SSH_KEY`
3. Verifica que tenga este formato:

```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAABlwAAAAdzc2gtcn
... (más líneas) ...
-----END OPENSSH PRIVATE KEY-----
```

**✅ Checklist:**

- [ ] Incluye `-----BEGIN OPENSSH PRIVATE KEY-----` al inicio
- [ ] Incluye `-----END OPENSSH PRIVATE KEY-----` al final
- [ ] Sin espacios extra al inicio o final
- [ ] Sin líneas vacías al inicio o final
- [ ] Es la clave privada (no la pública)

**Si generaste una nueva clave en el Paso 3:**

```bash
# En tu máquina local
cat ~/.ssh/github_actions_deploy

# Copia TODO el contenido y actualiza VPS_SSH_KEY en GitHub
```

**También verifica otros secrets:**

- [ ] `VPS_HOST` - IP de tu VPS (ej: `72.60.63.240`)
- [ ] `VPS_USER` - Usuario SSH (ej: `root`)
- [ ] `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE` - Credenciales PostgreSQL
- [ ] `JWT_SECRET` - Secret JWT (mínimo 32 caracteres)

---

## 🚀 Paso 8: Probar en GitHub Actions

1. Ve a: `Actions > Deploy to Hostinger VPS`
2. Click en `Run workflow`
3. Selecciona:
   - Branch: `main` o `develop`
   - Environment: `development` o `production`
4. Click en `Run workflow`
5. Observa el paso **"Test SSH connection"**

**Resultados:**

- ✅ **Si pasa**: ¡Perfecto! El deployment debería funcionar
- ❌ **Si falla**: Revisa los logs detallados (ahora con `-v`)

**Si falla, revisa los logs:**

Busca líneas que empiecen con `debug1:` para ver detalles de la conexión SSH.

**Errores comunes:**

1. **"Permission denied"**: La clave no está autorizada → Revisa Pasos 4 y 5
2. **"Connection timeout"**: Problema de red/firewall → Verifica puerto 22
3. **"No more authentication methods"**: Configuración SSH incorrecta → Verifica `/etc/ssh/sshd_config`

---

## 🆘 Si Aún No Funciona

### Opción 1: Usar Contraseña Temporalmente

Mientras solucionas el problema de SSH Key:

1. Agrega el secret `VPS_SSH_PASSWORD` en GitHub
2. El workflow usará contraseña en lugar de SSH Key
3. ⚠️ **Nota**: Menos seguro, úsalo solo temporalmente

### Opción 2: Verificar Logs del Servidor SSH

**En el VPS:**

```bash
# Ver logs de autenticación SSH
tail -f /var/log/auth.log
# O en algunos sistemas:
tail -f /var/log/secure

# Intenta conectarte desde GitHub Actions y observa los logs
# Verás mensajes como:
# "Failed publickey for root from ..."
# "Accepted publickey for root from ..."
```

### Opción 3: Regenerar Todo desde Cero

```bash
# 1. Generar nueva clave
ssh-keygen -t ed25519 -C "github-actions-new" -f ~/.ssh/github_actions_deploy_new

# 2. Copiar clave pública al VPS
ssh-copy-id -i ~/.ssh/github_actions_deploy_new.pub root@TU_VPS_IP

# 3. Probar conexión
ssh -i ~/.ssh/github_actions_deploy_new root@TU_VPS_IP

# 4. Si funciona, actualizar GitHub Secret VPS_SSH_KEY con:
cat ~/.ssh/github_actions_deploy_new
```

---

## ✅ Checklist Final

Antes de ejecutar el workflow nuevamente:

- [ ] Clave pública agregada a `~/.ssh/authorized_keys` en el VPS
- [ ] Permisos correctos: `chmod 600 ~/.ssh/authorized_keys`
- [ ] Permisos correctos: `chmod 700 ~/.ssh`
- [ ] Propiedad correcta: `chown -R usuario:usuario ~/.ssh`
- [ ] Conexión manual funciona: `ssh -i KEY root@IP` (sin pedir contraseña)
- [ ] Clave privada en GitHub Secrets tiene formato correcto (BEGIN/END)
- [ ] `VPS_USER` en GitHub Secrets coincide con el usuario del VPS
- [ ] `VPS_HOST` en GitHub Secrets es correcto
- [ ] Diagnóstico SSH muestra todo correcto

---

## 📚 Referencias

- [Diagnóstico SSH](diagnostico-ssh.sh) - Script de diagnóstico automático
- [Solución Rápida SSH](SOLUCION_RAPIDA_SSH.md) - Fix en 5 pasos
- [Mejores Prácticas SSH](MEJORES_PRACTICAS_SSH_GITHUB_ACTIONS.md) - Configuración completa
- [Troubleshooting SSH Permission Denied](TROUBLESHOOTING_SSH_PERMISSION_DENIED.md) - Guía detallada

---

**¡Sigue estos pasos en orden y deberías poder resolver el problema!** 🔧✅
