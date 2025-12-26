# 🔐 Mejores Prácticas: SSH Automático con GitHub Actions

## 🎯 Objetivo

Configurar SSH de manera que GitHub Actions pueda conectarse automáticamente al VPS **sin intervención manual** y de forma **segura y permanente**.

---

## ✅ La Mejor Solución: SSH Key Dedicada

### ¿Por qué SSH Key y no Contraseña?

| Método         | Seguridad       | Automatización           | Mantenimiento      |
| -------------- | --------------- | ------------------------ | ------------------ |
| **SSH Key**    | ⭐⭐⭐⭐⭐ Alta | ✅ Totalmente automático | ✅ Fácil rotación  |
| **Contraseña** | ⭐⭐ Baja       | ⚠️ Requiere gestión      | ❌ Difícil cambiar |

**Recomendación**: **Usar SSH Key dedicada exclusivamente para GitHub Actions**

---

## 🚀 Configuración Paso a Paso (Método Recomendado)

### Paso 1: Generar Clave SSH Dedicada

**En tu máquina local:**

```bash
# Generar clave SSH específica para GitHub Actions
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy

# Esto crea dos archivos:
# ~/.ssh/github_actions_deploy      (clave privada - para GitHub Secrets)
# ~/.ssh/github_actions_deploy.pub  (clave pública - para el VPS)
```

**⚠️ Importante**:

- **NO uses tu clave SSH personal** para GitHub Actions
- Usa una clave **dedicada** solo para este propósito
- Esto permite rotar la clave sin afectar tu acceso personal

---

### Paso 2: Configurar la Clave en el VPS

**Opción A: Automático (Recomendado si tienes acceso SSH con contraseña)**

```bash
# Copiar clave pública al VPS automáticamente
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub root@TU_VPS_IP

# Esto automáticamente:
# - Crea ~/.ssh si no existe
# - Agrega la clave a authorized_keys
# - Configura los permisos correctos
```

**Opción B: Manual (Si no tienes acceso SSH con contraseña)**

1. **Mostrar la clave pública:**

```bash
cat ~/.ssh/github_actions_deploy.pub
```

2. **Conectarte al VPS** (usando panel de Hostinger, otra clave, etc.)

3. **En el VPS, ejecutar:**

```bash
# Crear directorio si no existe
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Agregar clave pública
echo "TU_CLAVE_PUBLICA_COMPLETA_AQUI" >> ~/.ssh/authorized_keys

# Configurar permisos correctos
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh

# Verificar
cat ~/.ssh/authorized_keys
```

---

### Paso 3: Configurar GitHub Secret

1. **Obtener la clave privada:**

```bash
cat ~/.ssh/github_actions_deploy
```

2. **En GitHub:**
   - Ve a: `Settings > Secrets and variables > Actions`
   - Click en `New repository secret`
   - **Name**: `VPS_SSH_KEY`
   - **Secret**: Pega TODO el contenido de la clave privada (incluyendo `-----BEGIN OPENSSH PRIVATE KEY-----` y `-----END OPENSSH PRIVATE KEY-----`)

**Formato correcto:**

```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAABlwAAAAdzc2gtcn
... (más líneas) ...
-----END OPENSSH PRIVATE KEY-----
```

**✅ Checklist:**

- [ ] Incluye la línea `-----BEGIN OPENSSH PRIVATE KEY-----`
- [ ] Incluye la línea `-----END OPENSSH PRIVATE KEY-----`
- [ ] Sin espacios extra al inicio o final
- [ ] Sin líneas vacías al inicio o final
- [ ] Es la clave privada completa (no la pública)

---

### Paso 4: Configurar Otros Secrets Requeridos

```bash
# En GitHub Secrets, también necesitas:
VPS_HOST=72.60.63.240          # IP de tu VPS
VPS_USER=root                    # Usuario SSH (generalmente root)
DB_USERNAME=requirements_user    # Usuario PostgreSQL
DB_PASSWORD=tu_password_seguro   # Contraseña PostgreSQL
DB_DATABASE=requirements_db      # Nombre de la base de datos
JWT_SECRET=tu_secret_min_32_chars # Secret JWT (mínimo 32 caracteres)
```

---

### Paso 5: Verificar Configuración

**Desde tu máquina local:**

```bash
# Probar conexión con la nueva clave
ssh -i ~/.ssh/github_actions_deploy root@TU_VPS_IP

# Si funciona sin pedir contraseña, ✅ está configurado correctamente
```

**Desde GitHub Actions:**

1. Ve a: `Actions > Deploy to Hostinger VPS`
2. Click en `Run workflow`
3. Ejecuta manualmente
4. Verifica que el paso "Test SSH connection" pase ✅

---

## 🔒 Seguridad Avanzada (Opcional pero Recomendado)

### 1. Restringir Acceso por IP (Si es posible)

En el VPS, puedes restringir qué IPs pueden usar esta clave:

```bash
# Editar authorized_keys en el VPS
nano ~/.ssh/authorized_keys

# Agregar restricción de IP (reemplaza con IPs de GitHub Actions)
from="140.82.112.0/20" ssh-ed25519 AAAAC3... github-actions-deploy
```

**Rangos de IP de GitHub Actions:**

- `140.82.112.0/20`
- `143.55.64.0/20`
- `185.199.108.0/22`
- `192.30.252.0/22`

### 2. Usar Usuario Dedicado (En lugar de root)

```bash
# Crear usuario dedicado para deployments
useradd -m -s /bin/bash deployer
usermod -aG docker deployer  # Si usas Docker

# Configurar SSH para este usuario
mkdir -p /home/deployer/.ssh
chmod 700 /home/deployer/.ssh
echo "TU_CLAVE_PUBLICA" >> /home/deployer/.ssh/authorized_keys
chmod 600 /home/deployer/.ssh/authorized_keys
chown -R deployer:deployer /home/deployer/.ssh

# En GitHub Secrets, cambiar:
VPS_USER=deployer
```

### 3. Deshabilitar Autenticación por Contraseña

```bash
# Editar configuración SSH del servidor
sudo nano /etc/ssh/sshd_config

# Cambiar:
PasswordAuthentication no
PubkeyAuthentication yes

# Reiniciar SSH
sudo systemctl restart sshd
```

**⚠️ Advertencia**: Solo haz esto DESPUÉS de verificar que la clave SSH funciona correctamente.

---

## 🔄 Rotación de Claves (Mantenimiento)

### Cuándo Rotar

- Cada 90 días (recomendado)
- Si sospechas compromiso
- Si alguien con acceso deja el proyecto

### Cómo Rotar

1. **Generar nueva clave:**

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy-$(date +%Y%m%d)" -f ~/.ssh/github_actions_deploy_new
```

2. **Agregar nueva clave al VPS** (sin eliminar la antigua aún)

3. **Actualizar GitHub Secret** `VPS_SSH_KEY` con la nueva clave privada

4. **Verificar que funciona** ejecutando el workflow

5. **Eliminar clave antigua del VPS:**

```bash
# En el VPS, editar authorized_keys
nano ~/.ssh/authorized_keys
# Eliminar la línea de la clave antigua
```

---

## 📊 Comparación de Métodos

### Método 1: SSH Key Dedicada ⭐⭐⭐⭐⭐ (Recomendado)

**Ventajas:**

- ✅ Máxima seguridad
- ✅ Totalmente automático
- ✅ Fácil rotación
- ✅ No requiere contraseñas
- ✅ Puede restringirse por IP/usuario

**Desventajas:**

- ⚠️ Requiere configuración inicial

**Uso**: Producción, desarrollo, cualquier ambiente

---

### Método 2: Contraseña SSH ⭐⭐

**Ventajas:**

- ✅ Configuración rápida

**Desventajas:**

- ❌ Menos seguro
- ❌ Requiere gestión de contraseñas
- ❌ Difícil rotar
- ❌ Puede expirar

**Uso**: Solo para pruebas temporales

---

### Método 3: Deploy Keys de GitHub ⭐⭐⭐

**Ventajas:**

- ✅ Integrado con GitHub
- ✅ Fácil de configurar

**Desventajas:**

- ⚠️ Solo para clonar repositorios
- ⚠️ No permite ejecutar comandos SSH generales

**Uso**: Solo si necesitas clonar repositorios privados

---

## ✅ Checklist de Configuración Completa

### Configuración Inicial

- [ ] Clave SSH dedicada generada (`github_actions_deploy`)
- [ ] Clave pública agregada a `~/.ssh/authorized_keys` en el VPS
- [ ] Permisos correctos: `chmod 600 ~/.ssh/authorized_keys`
- [ ] Permisos correctos: `chmod 700 ~/.ssh`
- [ ] Clave privada en GitHub Secret `VPS_SSH_KEY`
- [ ] Formato correcto de la clave (BEGIN/END)
- [ ] Conexión manual funciona: `ssh -i KEY root@IP`
- [ ] Test SSH en GitHub Actions pasa ✅

### Secrets en GitHub

- [ ] `VPS_HOST` configurado
- [ ] `VPS_USER` configurado
- [ ] `VPS_SSH_KEY` configurado (o `VPS_SSH_PASSWORD` temporalmente)
- [ ] `DB_USERNAME` configurado
- [ ] `DB_PASSWORD` configurado
- [ ] `DB_DATABASE` configurado
- [ ] `JWT_SECRET` configurado (mínimo 32 caracteres)

### Verificación Final

- [ ] Workflow ejecuta sin errores
- [ ] Deployment se completa exitosamente
- [ ] Servicios funcionan en el VPS
- [ ] Health checks pasan

---

## 🆘 Troubleshooting

### Error: "Permission denied"

Ver: [SOLUCION_RAPIDA_SSH.md](SOLUCION_RAPIDA_SSH.md)

### Error: "No more authentication methods"

1. Verifica que la clave pública esté en `authorized_keys`
2. Verifica permisos: `chmod 600 ~/.ssh/authorized_keys`
3. Verifica configuración SSH: `PubkeyAuthentication yes`

### Error: "Connection timeout"

1. Verifica que el puerto 22 esté abierto
2. Verifica firewall del VPS
3. Verifica que `VPS_HOST` sea correcto

---

## 📚 Referencias

- [Configurar Secrets en GitHub](CONFIGURAR_SECRETS_GITHUB.md)
- [Solución Rápida SSH](SOLUCION_RAPIDA_SSH.md)
- [Troubleshooting SSH Permission Denied](TROUBLESHOOTING_SSH_PERMISSION_DENIED.md)
- [GitHub Docs: Using SSH keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
- [OpenSSH Manual](https://www.openssh.com/manual.html)

---

## 🎯 Resumen: La Mejor Práctica

1. ✅ **Genera una clave SSH dedicada** solo para GitHub Actions
2. ✅ **Agrega la clave pública al VPS** en `~/.ssh/authorized_keys`
3. ✅ **Configura permisos correctos** (600 para authorized_keys, 700 para .ssh)
4. ✅ **Guarda la clave privada en GitHub Secrets** como `VPS_SSH_KEY`
5. ✅ **Verifica la conexión** manualmente y luego en GitHub Actions
6. ✅ **Rota la clave periódicamente** (cada 90 días)

**Con esta configuración, GitHub Actions podrá conectarse automáticamente al VPS de forma segura y permanente.** 🚀🔐
