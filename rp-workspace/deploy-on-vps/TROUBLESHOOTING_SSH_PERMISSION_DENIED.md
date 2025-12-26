# 🔧 Troubleshooting: Permission denied (publickey,password)

## ❌ Error Común

```
Permission denied (publickey,password).
scp: Connection closed
Error: Process completed with exit code 255.
```

Este error ocurre cuando GitHub Actions intenta conectarse al VPS pero la autenticación SSH falla.

---

## 🔍 Diagnóstico

### Causas Comunes

1. **Clave SSH no autorizada en el servidor**
   - La clave pública no está en `~/.ssh/authorized_keys`
   - La clave pública está mal formateada

2. **Permisos incorrectos**
   - `~/.ssh/authorized_keys` no tiene permisos 600
   - `~/.ssh` no tiene permisos 700

3. **Clave SSH mal formateada en GitHub Secrets**
   - Falta la línea `-----BEGIN OPENSSH PRIVATE KEY-----`
   - Falta la línea `-----END OPENSSH PRIVATE KEY-----`
   - Tiene espacios o saltos de línea extra

4. **Usuario incorrecto**
   - `VPS_USER` no coincide con el usuario que tiene la clave autorizada

---

## ✅ Solución Paso a Paso

### Paso 1: Verificar la Clave SSH en GitHub Secrets

1. Ve a: `Settings > Secrets and variables > Actions`
2. Abre el secret `VPS_SSH_KEY`
3. Verifica que tenga este formato exacto:

```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAABlwAAAAdzc2gtcn
... (más líneas) ...
-----END OPENSSH PRIVATE KEY-----
```

**Importante:**
- ✅ Debe empezar con `-----BEGIN OPENSSH PRIVATE KEY-----`
- ✅ Debe terminar con `-----END OPENSSH PRIVATE KEY-----`
- ✅ No debe tener espacios extra al inicio o final
- ✅ No debe tener líneas vacías al inicio o final

### Paso 2: Obtener la Clave Pública Correspondiente

Si tienes la clave privada, puedes generar la clave pública:

```bash
# Si tienes la clave privada guardada localmente
ssh-keygen -y -f ~/.ssh/hostinger_deploy > ~/.ssh/hostinger_deploy.pub

# Mostrar la clave pública
cat ~/.ssh/hostinger_deploy.pub
```

**O si no tienes la clave privada localmente:**

1. Genera una nueva clave SSH:
```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/hostinger_deploy
```

2. Copia la clave pública:
```bash
cat ~/.ssh/hostinger_deploy.pub
```

3. Copia la clave privada completa a GitHub Secrets:
```bash
cat ~/.ssh/hostinger_deploy
```

### Paso 3: Agregar la Clave Pública al VPS

**Opción A: Usando ssh-copy-id (Recomendado)**

```bash
# Desde tu máquina local
ssh-copy-id -i ~/.ssh/hostinger_deploy.pub root@TU_VPS_IP
```

**Opción B: Manualmente**

1. Conectarte al VPS:
```bash
ssh root@TU_VPS_IP
```

2. Crear directorio .ssh si no existe:
```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
```

3. Agregar la clave pública:
```bash
# Copiar el contenido de la clave pública (del paso 2)
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... github-actions" >> ~/.ssh/authorized_keys
```

4. Ajustar permisos:
```bash
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

5. Verificar:
```bash
cat ~/.ssh/authorized_keys
# Deberías ver tu clave pública
```

### Paso 4: Verificar la Conexión Manualmente

Desde tu máquina local:

```bash
# Probar conexión con la clave
ssh -i ~/.ssh/hostinger_deploy root@TU_VPS_IP

# Si funciona, deberías conectarte sin pedir contraseña
```

### Paso 5: Verificar en GitHub Actions

1. Ve a: `Actions > Deploy to Hostinger VPS`
2. Ejecuta el workflow manualmente
3. Revisa el paso "Test SSH connection"
4. Si falla, revisa los logs detallados (con `-v` ahora se muestran)

---

## 🔧 Soluciones Alternativas

### Solución 1: Usar Contraseña SSH Temporalmente

Si necesitas hacer el deploy rápido mientras solucionas el problema de SSH Key:

1. Agrega el secret `VPS_SSH_PASSWORD` en GitHub
2. El workflow usará contraseña en lugar de SSH Key
3. ⚠️ **Nota**: Esto es menos seguro, úsalo solo temporalmente

### Solución 2: Verificar Usuario SSH

Asegúrate de que `VPS_USER` en GitHub Secrets coincida con el usuario que tiene la clave autorizada:

```bash
# En el VPS, verificar qué usuario tiene authorized_keys
cat ~/.ssh/authorized_keys

# Si es root, VPS_USER debe ser "root"
# Si es otro usuario, ajusta VPS_USER en GitHub Secrets
```

### Solución 3: Regenerar Clave SSH

Si nada funciona, regenera todo:

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

## 🧪 Verificación Final

### Checklist

- [ ] Clave SSH en GitHub Secrets tiene formato correcto (BEGIN/END)
- [ ] Clave pública está en `~/.ssh/authorized_keys` del VPS
- [ ] Permisos correctos: `chmod 600 ~/.ssh/authorized_keys`
- [ ] Permisos correctos: `chmod 700 ~/.ssh`
- [ ] `VPS_USER` en GitHub Secrets coincide con el usuario del VPS
- [ ] Conexión manual funciona: `ssh -i KEY root@IP`
- [ ] Test SSH en GitHub Actions pasa

### Comandos de Verificación en el VPS

```bash
# Conectarse al VPS
ssh root@TU_VPS_IP

# Verificar authorized_keys
ls -la ~/.ssh/authorized_keys
cat ~/.ssh/authorized_keys

# Verificar permisos
stat -c "%a %n" ~/.ssh/authorized_keys  # Debe ser 600
stat -c "%a %n" ~/.ssh                   # Debe ser 700

# Verificar contenido de authorized_keys
# Debe tener una línea con tu clave pública (ssh-ed25519 ...)
```

---

## 📚 Referencias

- [GitHub Docs: Using SSH keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
- [OpenSSH Manual: sshd](https://www.openssh.com/manual.html)
- [Guía: Configurar Secrets en GitHub](CONFIGURAR_SECRETS_GITHUB.md)

---

## 🆘 Si Nada Funciona

1. **Usa contraseña temporalmente**: Configura `VPS_SSH_PASSWORD` para hacer el deploy mientras solucionas SSH Key

2. **Verifica logs detallados**: El workflow ahora muestra logs con `-v` que ayudan a diagnosticar

3. **Contacta soporte**: Si el problema persiste, puede ser un problema de configuración del VPS o firewall

4. **Verifica firewall**: Asegúrate de que el puerto 22 (SSH) esté abierto:
```bash
# En el VPS
sudo ufw status
sudo ufw allow 22/tcp
```

---

**¡Con estos pasos deberías poder resolver el problema de "Permission denied"!** 🔐✅

