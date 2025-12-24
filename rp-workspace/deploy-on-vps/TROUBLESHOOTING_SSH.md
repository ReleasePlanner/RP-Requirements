# 🔧 Troubleshooting - Conexión SSH a Hostinger

## 🚨 Problema: No puedo conectarme al VPS

### Verificación Paso a Paso

#### 1. Verificar IP del VPS

**En el panel de Hostinger:**
- Ve a "VPS" → Selecciona tu VPS
- Verifica la IP pública: `72.60.63.240`
- Verifica que el VPS esté **encendido** (Status: Running)

#### 2. Verificar Credenciales SSH

**En el panel de Hostinger:**
- Ve a tu VPS → "SSH Access" o "Access Details"
- Verifica:
  - **Usuario SSH** (puede ser diferente a `root`)
  - **Puerto SSH** (puede ser diferente a `22`)
  - **Contraseña SSH** o si usa clave SSH

#### 3. Verificar Puerto SSH

Hostinger a veces usa puertos SSH personalizados. Verifica en el panel:
- Puerto estándar: `22`
- Puerto personalizado: puede ser `2222`, `2200`, etc.

**Comando con puerto personalizado:**
```bash
ssh -p PUERTO root@72.60.63.240
```

#### 4. Verificar Usuario SSH

El usuario puede ser diferente a `root`. Posibles usuarios:
- `root`
- `admin`
- `ubuntu`
- `debian`
- Un usuario personalizado que creaste

**Verificar en el panel de Hostinger:**
- VPS → SSH Access → Username

---

## 🔍 Comandos de Diagnóstico

### Probar conexión básica

```bash
# Probar ping
ping 72.60.63.240

# Probar conexión SSH (puerto estándar)
ssh -v root@72.60.63.240

# Probar con puerto personalizado (si aplica)
ssh -p 2222 root@72.60.63.240
```

### Ver información detallada del error

```bash
ssh -vvv root@72.60.63.240
```

Esto mostrará información detallada sobre por qué falla la conexión.

---

## 🔑 Posibles Problemas y Soluciones

### Problema 1: "Permission denied (publickey,password)"

**Causas posibles:**
- Contraseña incorrecta
- Usuario incorrecto
- El servidor solo acepta claves SSH

**Soluciones:**

**A) Verificar contraseña en Hostinger:**
- Ve al panel → VPS → Reset Password
- Genera una nueva contraseña
- Usa esa contraseña para conectarte

**B) Verificar usuario:**
```bash
# Probar con diferentes usuarios comunes
ssh admin@72.60.63.240
ssh ubuntu@72.60.63.240
ssh debian@72.60.63.240
```

**C) Configurar clave SSH:**
Si el servidor solo acepta claves:
```bash
# Generar clave SSH
ssh-keygen -t rsa -b 4096

# Copiar clave al servidor (si permite contraseña temporalmente)
ssh-copy-id root@72.60.63.240

# O manualmente:
cat ~/.ssh/id_rsa.pub | ssh root@72.60.63.240 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

### Problema 2: "Connection refused" o "Connection timed out"

**Causas posibles:**
- VPS apagado
- Firewall bloqueando
- Puerto SSH incorrecto
- IP incorrecta

**Soluciones:**

**A) Verificar que VPS esté encendido:**
- Panel Hostinger → VPS → Verificar Status
- Si está apagado, enciéndelo

**B) Verificar firewall:**
- Panel Hostinger → VPS → Firewall
- Asegúrate de que el puerto SSH (22 o el que uses) esté abierto

**C) Verificar IP:**
- Confirma que la IP `72.60.63.240` sea correcta en el panel

### Problema 3: "Host key verification failed"

**Solución:**
```bash
# Eliminar clave antigua del known_hosts
ssh-keygen -R 72.60.63.240

# O aceptar automáticamente
ssh -o StrictHostKeyChecking=no root@72.60.63.240
```

---

## 📋 Información Necesaria de Hostinger

Para ayudarte mejor, necesito que verifiques en el panel de Hostinger:

1. **IP del VPS:** ¿Es `72.60.63.240`?
2. **Usuario SSH:** ¿Es `root` o otro?
3. **Puerto SSH:** ¿Es `22` o otro?
4. **Estado del VPS:** ¿Está encendido?
5. **Método de autenticación:** ¿Contraseña o clave SSH?
6. **Contraseña:** ¿Es `Aar-Beto-2026` o diferente?

---

## 🔄 Alternativa: Usar Panel de Hostinger

Si no puedes conectarte por SSH, puedes usar el **Terminal Web** de Hostinger:

1. Ve al panel de Hostinger
2. VPS → Tu VPS → "Terminal" o "Web Terminal"
3. Ejecuta los comandos directamente desde ahí

**Comandos a ejecutar en el Terminal Web:**

```bash
# 1. Verificar sistema
uname -a
docker --version

# 2. Si Docker no está instalado, instalar
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 3. Instalar Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# 4. Clonar repositorio
mkdir -p /opt/modules
cd /opt/modules
git clone https://github.com/ReleasePlanner/RP-Requirements.git requirements-management
cd requirements-management

# 5. Continuar con el deployment...
```

---

## 🆘 Si Nada Funciona

**Contacta a Hostinger:**
- Soporte técnico de Hostinger
- Pregunta sobre:
  - Credenciales SSH correctas
  - Puerto SSH
  - Estado del VPS
  - Configuración de firewall

---

## 📝 Checklist de Verificación

- [ ] VPS está encendido en el panel
- [ ] IP es correcta: `72.60.63.240`
- [ ] Usuario SSH es correcto (verificar en panel)
- [ ] Contraseña es correcta (o resetear en panel)
- [ ] Puerto SSH es correcto (verificar en panel)
- [ ] Firewall permite conexión SSH
- [ ] Puedo hacer ping a la IP: `ping 72.60.63.240`

---

**¿Qué información puedes verificar en el panel de Hostinger?**

