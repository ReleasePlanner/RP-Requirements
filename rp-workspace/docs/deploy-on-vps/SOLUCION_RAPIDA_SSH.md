# ⚡ Solución Rápida: Permission denied (publickey,password)

## 🎯 Problema

```
Permission denied (publickey,password).
scp: Connection closed
```

**Causa**: La clave pública SSH no está autorizada en el servidor VPS.

---

## ✅ Solución en 5 Pasos

### Paso 1: Generar o Obtener tu Clave Pública SSH

**Si ya tienes la clave privada en GitHub Secrets:**

```bash
# Desde tu máquina local, extrae la clave pública
# Primero, guarda temporalmente la clave privada de GitHub Secrets en un archivo
# Luego ejecuta:
ssh-keygen -y -f /ruta/a/tu/clave_privada > clave_publica.pub
cat clave_publica.pub
```

**Si necesitas generar una nueva clave:**

```bash
# Generar nueva clave SSH
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/hostinger_deploy

# Mostrar la clave pública
cat ~/.ssh/hostinger_deploy.pub
```

**Copia la clave pública completa** (debe empezar con `ssh-ed25519` o `ssh-rsa`)

---

### Paso 2: Conectarte al VPS

```bash
# Conectarte usando contraseña (si tienes acceso)
ssh root@TU_VPS_IP

# O si tienes otra forma de acceso (panel de Hostinger, etc.)
```

---

### Paso 3: Ejecutar Script de Configuración (Recomendado)

```bash
# En el VPS, descargar y ejecutar el script
curl -o fix-ssh-setup.sh https://raw.githubusercontent.com/TU_REPO/main/rp-workspace/deploy-on-vps/fix-ssh-setup.sh
# O copiar el contenido del archivo fix-ssh-setup.sh manualmente

# Dar permisos de ejecución
chmod +x fix-ssh-setup.sh

# Ejecutar
bash fix-ssh-setup.sh
```

**O manualmente:**

```bash
# En el VPS
mkdir -p ~/.ssh
chmod 700 ~/.ssh
touch ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

---

### Paso 4: Agregar tu Clave Pública

**Opción A: Usando ssh-copy-id (Desde tu máquina local)**

```bash
# Si tienes acceso SSH con contraseña desde tu máquina
ssh-copy-id -i ~/.ssh/hostinger_deploy.pub root@TU_VPS_IP
```

**Opción B: Manualmente (En el VPS)**

```bash
# Conectado al VPS, ejecuta:
echo "TU_CLAVE_PUBLICA_COMPLETA_AQUI" >> ~/.ssh/authorized_keys

# Ejemplo:
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... github-actions" >> ~/.ssh/authorized_keys

# Verificar que se agregó correctamente
cat ~/.ssh/authorized_keys
```

**⚠️ Importante**: 
- Reemplaza `TU_CLAVE_PUBLICA_COMPLETA_AQUI` con la clave pública completa del Paso 1
- Debe ser UNA línea completa
- No agregues saltos de línea

---

### Paso 5: Verificar Permisos

```bash
# En el VPS, verificar permisos
ls -la ~/.ssh/

# Debe mostrar:
# drwx------  .ssh (700)
# -rw-------  authorized_keys (600)

# Si no están correctos, corregir:
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

---

## 🧪 Verificación

### Desde tu Máquina Local

```bash
# Probar conexión SSH
ssh -i ~/.ssh/hostinger_deploy root@TU_VPS_IP

# Si funciona sin pedir contraseña, ¡está listo! ✅
```

### Desde GitHub Actions

1. Ve a: `Actions > Deploy to Hostinger VPS`
2. Ejecuta el workflow manualmente
3. Verifica que el paso "Test SSH connection" pase ✅

---

## 🔍 Diagnóstico Avanzado

### Verificar en el VPS

```bash
# Ver claves autorizadas
cat ~/.ssh/authorized_keys

# Verificar permisos
stat -c "%a %n" ~/.ssh/authorized_keys  # Debe ser 600
stat -c "%a %n" ~/.ssh                   # Debe ser 700

# Verificar configuración SSH del servidor
grep PubkeyAuthentication /etc/ssh/sshd_config
# Debe mostrar: PubkeyAuthentication yes

# Si está deshabilitado, habilitarlo:
sudo nano /etc/ssh/sshd_config
# Cambiar: PubkeyAuthentication no -> PubkeyAuthentication yes
sudo systemctl restart sshd
```

### Verificar Clave en GitHub Secrets

1. Ve a: `Settings > Secrets and variables > Actions`
2. Abre `VPS_SSH_KEY`
3. Verifica que tenga este formato:

```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAABlwAAAAdzc2gtcn
... (más líneas) ...
-----END OPENSSH PRIVATE KEY-----
```

**Debe tener:**
- ✅ Línea `-----BEGIN OPENSSH PRIVATE KEY-----` al inicio
- ✅ Línea `-----END OPENSSH PRIVATE KEY-----` al final
- ✅ Sin espacios extra al inicio o final
- ✅ Sin líneas vacías al inicio o final

---

## 🆘 Si Aún No Funciona

### Opción 1: Usar Contraseña Temporalmente

Mientras solucionas el problema de SSH Key:

1. Agrega el secret `VPS_SSH_PASSWORD` en GitHub
2. El workflow usará contraseña en lugar de SSH Key
3. ⚠️ **Nota**: Menos seguro, úsalo solo temporalmente

### Opción 2: Verificar Logs Detallados

El workflow ahora muestra logs con `-v` que ayudan a diagnosticar:

```bash
# En GitHub Actions, revisa los logs del paso "Test SSH connection"
# Busca líneas que empiecen con "debug1:"
```

### Opción 3: Regenerar Todo

```bash
# 1. Generar nueva clave
ssh-keygen -t ed25519 -C "github-actions-new" -f ~/.ssh/hostinger_deploy_new

# 2. Copiar clave pública al VPS
ssh-copy-id -i ~/.ssh/hostinger_deploy_new.pub root@TU_VPS_IP

# 3. Probar conexión
ssh -i ~/.ssh/hostinger_deploy_new root@TU_VPS_IP

# 4. Si funciona, actualizar GitHub Secret VPS_SSH_KEY con:
cat ~/.ssh/hostinger_deploy_new
```

---

## 📚 Referencias

- [Guía Completa de Troubleshooting](TROUBLESHOOTING_SSH_PERMISSION_DENIED.md)
- [Configurar Secrets en GitHub](CONFIGURAR_SECRETS_GITHUB.md)
- [Script de Configuración Automática](fix-ssh-setup.sh)

---

## ✅ Checklist Final

Antes de ejecutar el workflow nuevamente:

- [ ] Clave pública agregada a `~/.ssh/authorized_keys` en el VPS
- [ ] Permisos correctos: `chmod 600 ~/.ssh/authorized_keys`
- [ ] Permisos correctos: `chmod 700 ~/.ssh`
- [ ] Conexión manual funciona: `ssh -i KEY root@IP` (sin pedir contraseña)
- [ ] Clave privada en GitHub Secrets tiene formato correcto (BEGIN/END)
- [ ] `VPS_USER` en GitHub Secrets coincide con el usuario del VPS

**¡Con estos pasos deberías poder resolver el problema!** 🚀✅

