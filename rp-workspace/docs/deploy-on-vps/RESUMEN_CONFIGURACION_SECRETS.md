# ⚡ Resumen Rápido: Configurar Secrets en GitHub

## 🎯 Pasos Rápidos (5 minutos)

### 1️⃣ Acceder a Secrets

```
GitHub Repo → Settings → Secrets and variables → Actions → New repository secret
```

### 2️⃣ Agregar Secrets Obligatorios

Copia y pega estos nombres exactos en GitHub:

| Nombre del Secret | Valor | Dónde Obtenerlo |
|-------------------|-------|-----------------|
| `VPS_HOST` | IP de tu VPS | Panel Hostinger → VPS → IP Address |
| `VPS_USER` | `root` | Usuario SSH (generalmente `root`) |
| `VPS_SSH_KEY` | Clave privada SSH | Ver abajo ⬇️ |
| `DB_USERNAME` | `requirements_user` | Usuario PostgreSQL |
| `DB_PASSWORD` | Tu contraseña | Contraseña PostgreSQL |
| `DB_DATABASE` | `requirements_db` | Nombre de la BD |
| `JWT_SECRET` | String 32+ chars | Generar con: `openssl rand -base64 32` |

### 3️⃣ Generar SSH Key (Si no tienes)

```bash
# Generar clave SSH
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/hostinger_deploy

# Copiar clave pública al VPS
ssh-copy-id -i ~/.ssh/hostinger_deploy.pub root@TU_VPS_IP

# Mostrar clave privada (copiar TODO)
cat ~/.ssh/hostinger_deploy
```

**Importante**: Copia TODO el contenido incluyendo:
```
-----BEGIN OPENSSH PRIVATE KEY-----
... (todo el contenido) ...
-----END OPENSSH PRIVATE KEY-----
```

### 4️⃣ Verificar

1. Ve a: `Actions > Deploy to Hostinger VPS > Run workflow`
2. Ejecuta el workflow manualmente
3. Verifica que el paso "Test SSH connection" pase ✅

---

## 📚 Guía Completa

Para instrucciones detalladas, ver: [CONFIGURAR_SECRETS_GITHUB.md](CONFIGURAR_SECRETS_GITHUB.md)

---

## 🔒 Seguridad

- ✅ Usa SSH Key en lugar de contraseña
- ✅ Nunca compartas los secrets públicamente
- ✅ Rota los secrets periódicamente

