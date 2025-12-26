# 🔧 Troubleshooting GitHub Actions Deployment

Guía completa para resolver problemas comunes con el deployment automático desde GitHub Actions a Hostinger VPS.

## 🔍 Diagnóstico Rápido

### Paso 1: Verificar el Workflow en GitHub

1. Ve a tu repositorio en GitHub
2. Click en **Actions**
3. Busca el workflow **"Deploy to Hostinger VPS"**
4. Click en el último run (éxito o fallo)
5. Revisa los logs de cada step

### Paso 2: Identificar el Error

Los errores más comunes aparecen en estos steps:

- ❌ **"Test SSH connection"** → Problema de conexión SSH
- ❌ **"Create deployment script"** → Problema con el script
- ❌ **"Copy deployment script to VPS"** → Problema de transferencia
- ❌ **"Execute deployment on VPS"** → Problema en el VPS

## 🐛 Problemas Comunes y Soluciones

### Error 1: "No SSH credentials provided"

**Síntoma:**
```
❌ No SSH credentials provided
```

**Causa:** No hay `VPS_SSH_KEY` ni `VPS_SSH_PASSWORD` configurados.

**Solución:**
1. Ve a GitHub > Settings > Secrets and variables > Actions
2. Verifica que exista:
   - `VPS_SSH_KEY` (clave privada SSH) **O**
   - `VPS_SSH_PASSWORD` (contraseña SSH)
3. Si no existen, créalos:
   - Click en **New repository secret**
   - Nombre: `VPS_SSH_PASSWORD`
   - Valor: `Aar-Beto-2026` (o tu contraseña)

### Error 2: "SSH connection failed" / "Permission denied"

**Síntoma:**
```
ssh: connect to host 72.60.63.240 port 22: Connection refused
# O
Permission denied (publickey,password)
```

**Causa:** Problema de autenticación SSH.

**Solución:**

#### Opción A: Usar Contraseña (Más Simple)

1. Verifica que `VPS_SSH_PASSWORD` esté configurado en GitHub Secrets
2. Verifica que la contraseña sea correcta
3. Prueba manualmente:
   ```bash
   ssh root@72.60.63.240
   ```

#### Opción B: Usar SSH Key (Más Seguro)

1. Genera una clave SSH:
   ```bash
   ssh-keygen -t ed25519 -C "github-actions"
   ```

2. Copia la clave pública al VPS:
   ```bash
   ssh-copy-id root@72.60.63.240
   # O manualmente:
   cat ~/.ssh/id_ed25519.pub | ssh root@72.60.63.240 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
   ```

3. Copia la clave privada a GitHub Secrets:
   ```bash
   cat ~/.ssh/id_ed25519
   # Copia TODO el contenido (incluyendo -----BEGIN y -----END)
   ```

4. En GitHub:
   - Secret name: `VPS_SSH_KEY`
   - Secret value: (pega la clave privada completa)

### Error 3: "VPS_HOST is empty" / "VPS_USER is empty"

**Síntoma:**
```
ssh: Could not resolve hostname: port 22
```

**Causa:** Secrets `VPS_HOST` o `VPS_USER` no configurados.

**Solución:**
1. Ve a GitHub Secrets
2. Verifica que existan:
   - `VPS_HOST` = `72.60.63.240`
   - `VPS_USER` = `root` (o tu usuario)

### Error 4: "Docker is not installed"

**Síntoma:**
```
❌ Docker is not installed
```

**Causa:** Docker no está instalado en el VPS.

**Solución:**
```bash
# Conectar al VPS
ssh root@72.60.63.240

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verificar instalación
docker --version
docker-compose --version
```

### Error 5: "Permission denied" al crear directorio

**Síntoma:**
```
mkdir: cannot create directory '/opt/modules': Permission denied
```

**Causa:** Permisos insuficientes en `/opt/modules`.

**Solución:**
```bash
# Conectar al VPS
ssh root@72.60.63.240

# Crear directorio con permisos correctos
sudo mkdir -p /opt/modules
sudo chown -R root:root /opt/modules
sudo chmod 755 /opt/modules
```

### Error 6: "Git clone failed" / "Repository not found"

**Síntoma:**
```
fatal: repository 'https://github.com/...' not found
# O
Permission denied (publickey)
```

**Causa:** El repositorio es privado y GitHub Actions no puede clonarlo.

**Solución:**

#### Opción A: Repositorio Público
- Cambia el repositorio a público temporalmente, o

#### Opción B: Deploy Key (Recomendado)

1. Genera una clave SSH en el VPS:
   ```bash
   ssh root@72.60.63.240
   ssh-keygen -t ed25519 -C "deploy-key" -f ~/.ssh/deploy_key
   cat ~/.ssh/deploy_key.pub
   ```

2. En GitHub:
   - Ve a Settings > Deploy keys > Add deploy key
   - Title: `VPS Deploy Key`
   - Key: (pega la clave pública)
   - ✅ Allow write access (si necesitas hacer push)

3. Modifica el workflow para usar la deploy key (ver sección avanzada)

#### Opción C: Personal Access Token

1. Crea un Personal Access Token en GitHub:
   - Settings > Developer settings > Personal access tokens > Tokens (classic)
   - Generate new token (classic)
   - Scopes: `repo` (full control)
   - Copia el token

2. En GitHub Secrets:
   - Secret name: `GITHUB_TOKEN`
   - Secret value: (tu token)

3. El workflow usará automáticamente `GITHUB_TOKEN` para clonar

### Error 7: "sshpass: command not found"

**Síntoma:**
```
sshpass: command not found
```

**Causa:** `sshpass` no está instalado en el runner de GitHub Actions.

**Solución:** El workflow ya incluye la instalación automática, pero si falla:

```yaml
# Ya está en el workflow, pero verifica que esté:
- name: Install SSH tools
  run: |
    sudo apt-get update
    sudo apt-get install -y openssh-client sshpass || true
```

### Error 8: "docker-compose: command not found"

**Síntoma:**
```
docker-compose: command not found
```

**Causa:** Docker Compose no está instalado o no está en el PATH.

**Solución:**
```bash
# En el VPS
ssh root@72.60.63.240

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verificar
docker-compose --version
```

### Error 9: "Secrets not found" / Variables vacías

**Síntoma:**
```
DB_USERNAME is empty
# O
Secrets are not available
```

**Causa:** Secrets no configurados o con nombres incorrectos.

**Solución:**

Verifica que todos estos secrets existan en GitHub:

```bash
# Requeridos
VPS_HOST=72.60.63.240
VPS_USER=root
VPS_SSH_PASSWORD=Aar-Beto-2026  # O VPS_SSH_KEY

# Base de datos
DB_USERNAME=requirements_user
DB_PASSWORD=<tu-password>
DB_DATABASE=requirements_db

# JWT
JWT_SECRET=<tu-secret-min-32-chars>

# Opcionales pero recomendados
NEXT_PUBLIC_API_URL_DEV=http://requirements-api.beyondnet.cloud/api/v1
NEXT_PUBLIC_API_URL_PRODUCTION=https://requirements-api.beyondnet.cloud/api/v1
```

### Error 10: "Workflow not triggered"

**Síntoma:** El workflow no se ejecuta al hacer push.

**Causa:** El workflow está en la rama incorrecta o tiene errores de sintaxis.

**Solución:**

1. Verifica que el archivo esté en `.github/workflows/deploy-hostinger.yml`
2. Verifica la sintaxis YAML:
   ```bash
   # En tu máquina local
   yamllint .github/workflows/deploy-hostinger.yml
   ```
3. Verifica que el workflow esté en la rama correcta:
   - Debe estar en `main` o `develop`
   - O hacer merge a la rama donde quieres que se ejecute

## 🔍 Debugging Avanzado

### Habilitar Debug Mode

Agrega estos secrets en GitHub para ver más detalles:

```bash
ACTIONS_STEP_DEBUG=true
ACTIONS_RUNNER_DEBUG=true
```

### Ver Logs Detallados en el VPS

```bash
# Conectar al VPS durante el deployment
ssh root@72.60.63.240

# Ver logs en tiempo real
tail -f /var/log/syslog

# O si el script está ejecutándose
ps aux | grep deploy
```

### Probar Conexión SSH Manualmente

```bash
# Desde tu máquina local
ssh root@72.60.63.240

# Con contraseña (si sshpass está instalado)
sshpass -p 'Aar-Beto-2026' ssh root@72.60.63.240

# Con clave SSH
ssh -i ~/.ssh/id_ed25519 root@72.60.63.240
```

### Verificar Variables de Entorno en el Workflow

Agrega este step temporalmente para debug:

```yaml
- name: Debug Environment
  run: |
    echo "VPS_HOST: ${{ secrets.VPS_HOST }}"
    echo "VPS_USER: ${{ secrets.VPS_USER }}"
    echo "Has SSH Key: ${{ secrets.VPS_SSH_KEY != '' }}"
    echo "Has SSH Password: ${{ secrets.VPS_SSH_PASSWORD != '' }}"
```

## 📋 Checklist de Verificación

Antes de reportar un problema, verifica:

- [ ] Todos los secrets están configurados en GitHub
- [ ] Los nombres de los secrets son exactos (case-sensitive)
- [ ] Puedes conectarte al VPS manualmente con SSH
- [ ] Docker está instalado en el VPS
- [ ] Docker Compose está instalado en el VPS
- [ ] El directorio `/opt/modules` existe y tiene permisos
- [ ] El repositorio es accesible (público o con deploy key)
- [ ] El workflow está en la rama correcta
- [ ] La sintaxis YAML del workflow es correcta

## 🆘 Obtener Ayuda

Si nada funciona:

1. **Copia los logs completos** del workflow fallido
2. **Verifica cada step** individualmente
3. **Prueba manualmente** cada comando en el VPS
4. **Revisa** [GITHUB_HOSTINGER_INTEGRATION.md](GITHUB_HOSTINGER_INTEGRATION.md)

## 🔄 Workflow Simplificado para Testing

Si el workflow completo falla, prueba este workflow simplificado:

```yaml
name: Test SSH Connection

on:
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Install SSH tools
        run: |
          sudo apt-get update
          sudo apt-get install -y openssh-client sshpass

      - name: Test SSH
        run: |
          sshpass -p '${{ secrets.VPS_SSH_PASSWORD }}' \
            ssh -o StrictHostKeyChecking=no \
            ${{ secrets.VPS_USER }}@${{ secrets.VPS_HOST }} \
            "echo 'SSH connection successful!'"
```

Guarda esto como `.github/workflows/test-ssh.yml` y ejecútalo manualmente para probar solo la conexión SSH.

---

**¿Sigue sin funcionar?** Comparte los logs específicos del error y te ayudo a resolverlo.

