# 🚀 Comandos Rápidos para Verificar y Configurar el Servidor SSH

## 🔍 Verificación Rápida

### Conectarse al Servidor

```bash
ssh root@72.60.63.240
```

### Verificar PasswordAuthentication

```bash
sudo cat /etc/ssh/sshd_config | grep -i PasswordAuthentication
```

**Resultado esperado:**
```
PasswordAuthentication yes
```

---

## 🔧 Habilitar PasswordAuthentication (Si está deshabilitado)

### Método 1: Comando Rápido (Una Línea)

```bash
sudo sed -i 's/#PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config && \
sudo sed -i 's/PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config && \
sudo systemctl restart sshd
```

### Método 2: Editar Manualmente

```bash
# 1. Editar configuración
sudo nano /etc/ssh/sshd_config

# 2. Buscar y cambiar:
#    #PasswordAuthentication no
#    O
#    PasswordAuthentication no
#    
#    A:
#    PasswordAuthentication yes

# 3. Guardar (Ctrl+X, luego Y, luego Enter)

# 4. Reiniciar SSH
sudo systemctl restart sshd
```

### Verificar Cambios

```bash
sudo cat /etc/ssh/sshd_config | grep PasswordAuthentication
```

Debería mostrar:
```
PasswordAuthentication yes
```

---

## 📋 Verificación Completa del Servidor

### 1. Verificar Configuración SSH Completa

```bash
sudo cat /etc/ssh/sshd_config | grep -E "(PasswordAuthentication|PubkeyAuthentication|PermitRootLogin)"
```

### 2. Verificar Estado del Servicio SSH

```bash
sudo systemctl status sshd
```

### 3. Verificar Puerto SSH

```bash
sudo netstat -tlnp | grep :22
# O
sudo ss -tlnp | grep :22
```

### 4. Verificar Versión SSH

```bash
sshd -V
```

### 5. Ver Logs de SSH

```bash
sudo tail -f /var/log/auth.log
# O en algunos sistemas:
sudo journalctl -u sshd -f
```

---

## ✅ Checklist de Verificación

Ejecuta estos comandos en el servidor para verificar todo:

```bash
# 1. Verificar PasswordAuthentication
echo "1. PasswordAuthentication:"
sudo cat /etc/ssh/sshd_config | grep -i "^PasswordAuthentication" | grep -v "^#"

# 2. Verificar estado del servicio
echo "2. Estado del servicio SSH:"
sudo systemctl is-active sshd

# 3. Verificar puerto
echo "3. Puerto SSH:"
sudo netstat -tlnp | grep :22 | head -1

# 4. Verificar versión
echo "4. Versión SSH:"
sshd -V 2>&1 | head -1
```

---

## 🔐 Alternativa: Usar Clave SSH (Más Seguro)

Si prefieres usar claves SSH en lugar de contraseña:

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
3. Opcionalmente, elimina `VPS_SSH_PASSWORD`

---

## 🚨 Troubleshooting

### Error: "Permission denied (publickey,password)"

**Solución:**

1. Verifica PasswordAuthentication:
   ```bash
   sudo cat /etc/ssh/sshd_config | grep PasswordAuthentication
   ```

2. Si muestra `no`, habilítalo:
   ```bash
   sudo sed -i 's/PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config
   sudo systemctl restart sshd
   ```

3. Verifica que funciona:
   ```bash
   ssh root@72.60.63.240
   ```

### Error: "Connection refused"

**Solución:**

```bash
# Verificar que SSH está corriendo
sudo systemctl status sshd

# Si no está corriendo, iniciarlo
sudo systemctl start sshd

# Verificar puerto
sudo netstat -tlnp | grep :22
```

### Error: "Could not resolve hostname"

**Solución:**

Verifica que la IP del servidor sea correcta:
```bash
ping 72.60.63.240
```

---

## 📝 Notas Importantes

- **Seguridad**: Habilitar autenticación por contraseña es menos seguro que usar claves SSH
- **Producción**: Para producción, considera usar claves SSH y deshabilitar autenticación por contraseña
- **CI/CD**: Para GitHub Actions, las claves SSH son más seguras y confiables

---

## 🔗 Scripts Disponibles

- `verificar-servidor-ssh.sh` - Script automatizado para verificar configuración SSH
- `test-ssh-interactivo.sh` - Script para probar conexión SSH
- `VERIFICAR_SERVIDOR_SSH.md` - Guía completa de verificación

