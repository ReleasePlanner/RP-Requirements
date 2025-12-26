# 🔍 Verificar Configuración SSH del Servidor

## ⚠️ Problema Común

Si el workflow falla con `Permission denied (publickey,password)`, puede ser que el servidor VPS tenga deshabilitada la autenticación por contraseña.

## 🔍 Verificación Paso a Paso

### 1. Conectarse al VPS Manualmente

```bash
ssh root@72.60.63.240
# Ingresa tu contraseña cuando se solicite
```

### 2. Verificar Configuración SSH

Una vez conectado al servidor, ejecuta:

```bash
# Ver la configuración actual
sudo cat /etc/ssh/sshd_config | grep -i PasswordAuthentication
```

**Resultado esperado:**
```
PasswordAuthentication yes
```

**Si muestra `PasswordAuthentication no` o está comentado (`#PasswordAuthentication no`):**

### 3. Habilitar Autenticación por Contraseña

```bash
# Editar el archivo de configuración
sudo nano /etc/ssh/sshd_config
```

Busca la línea:
```
#PasswordAuthentication no
```

O:
```
PasswordAuthentication no
```

Cámbiala a:
```
PasswordAuthentication yes
```

Guarda y cierra (Ctrl+X, luego Y, luego Enter).

### 4. Reiniciar el Servicio SSH

```bash
# Reiniciar SSH daemon
sudo systemctl restart sshd

# Verificar que el servicio está corriendo
sudo systemctl status sshd
```

### 5. Verificar que Funciona

Desde tu máquina local, prueba:

```bash
ssh root@72.60.63.240
```

Deberías poder conectarte con tu contraseña.

## 🔧 Comando Rápido (Una Línea)

Si prefieres hacerlo todo de una vez:

```bash
# Habilitar password authentication
sudo sed -i 's/#PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config
sudo sed -i 's/PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config

# Reiniciar SSH
sudo systemctl restart sshd

# Verificar
sudo cat /etc/ssh/sshd_config | grep PasswordAuthentication
```

## 🔐 Alternativa: Usar Clave SSH (Más Seguro)

Si prefieres usar claves SSH en lugar de contraseña (más seguro para CI/CD):

### 1. Generar Clave SSH (en tu máquina local)

```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/id_ed25519_github
```

### 2. Copiar Clave Pública al Servidor

```bash
ssh-copy-id -i ~/.ssh/id_ed25519_github.pub root@72.60.63.240
```

O manualmente:

```bash
# Ver tu clave pública
cat ~/.ssh/id_ed25519_github.pub

# Conectarte al servidor
ssh root@72.60.63.240

# En el servidor, agregar la clave
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "TU_CLAVE_PUBLICA_AQUI" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### 3. Configurar GitHub Secrets

1. Ve a: `https://github.com/TU_USUARIO/TU_REPO/settings/secrets/actions`
2. Agrega `VPS_SSH_KEY` con el contenido de `~/.ssh/id_ed25519_github` (clave privada)
3. Opcionalmente, elimina `VPS_SSH_PASSWORD` para forzar autenticación por clave

## 📋 Verificación Completa del Servidor

Para verificar toda la configuración SSH:

```bash
# Conectarse al servidor
ssh root@72.60.63.240

# Ver configuración completa
sudo cat /etc/ssh/sshd_config | grep -E "(PasswordAuthentication|PubkeyAuthentication|PermitRootLogin)"

# Verificar que SSH está escuchando
sudo netstat -tlnp | grep :22

# Ver logs de SSH
sudo tail -f /var/log/auth.log
# O en algunos sistemas:
sudo journalctl -u sshd -f
```

## ✅ Checklist de Verificación

- [ ] `PasswordAuthentication yes` en `/etc/ssh/sshd_config`
- [ ] Servicio SSH reiniciado (`sudo systemctl restart sshd`)
- [ ] Puedes conectarte manualmente con contraseña
- [ ] La contraseña en GitHub Secrets es exactamente la misma
- [ ] No hay espacios extra en la contraseña
- [ ] El usuario (`VPS_USER`) es correcto (generalmente `root`)

## 🚨 Troubleshooting

### Error: "Permission denied (publickey,password)"

**Causas posibles:**
1. ❌ `PasswordAuthentication no` en el servidor
2. ❌ Contraseña incorrecta en GitHub Secrets
3. ❌ Usuario incorrecto
4. ❌ Firewall bloqueando conexiones SSH

**Solución:**
1. Verifica `PasswordAuthentication yes` en el servidor
2. Prueba la contraseña manualmente: `ssh root@72.60.63.240`
3. Verifica que `VPS_USER` sea `root`
4. Verifica que el puerto 22 esté abierto

### Error: "Connection refused"

**Causas posibles:**
1. ❌ Servidor SSH no está corriendo
2. ❌ Firewall bloqueando el puerto 22
3. ❌ IP incorrecta

**Solución:**
```bash
# En el servidor
sudo systemctl status sshd
sudo systemctl start sshd
sudo ufw allow 22/tcp  # Si usas UFW
```

## 📝 Notas Importantes

- **Seguridad**: Habilitar autenticación por contraseña es menos seguro que usar claves SSH
- **Producción**: Para producción, considera usar claves SSH y deshabilitar autenticación por contraseña
- **CI/CD**: Para GitHub Actions, las claves SSH son más seguras y confiables

## 🔗 Archivos Relacionados

- [Solución Definitiva Permission Denied](SOLUCION_DEFINITIVA_PERMISSION_DENIED.md)
- [Mejoras Workflow SSHPASS](MEJORAS_WORKFLOW_SSHPASS.md)
- [Instalar SSHPASS Windows](INSTALAR_SSHPASS_WINDOWS.md)

