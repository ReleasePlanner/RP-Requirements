# 🚀 Próximos Pasos: Deploy con Contraseña SSH

## ✅ Estado Actual

- [x] Contraseña SSH configurada en GitHub Secrets (`VPS_SSH_PASSWORD`)
- [x] Workflow configurado para usar contraseña cuando está disponible
- [ ] Verificar otros secrets requeridos
- [ ] Ejecutar workflow de prueba
- [ ] Verificar deployment exitoso

---

## 📋 Verificación de Secrets en GitHub

Antes de ejecutar el workflow, verifica que todos estos secrets estén configurados:

### 🔴 Secrets Obligatorios

- [x] `VPS_SSH_PASSWORD` - ✅ Ya configurado
- [ ] `VPS_HOST` - IP de tu VPS (ej: `72.60.63.240`)
- [ ] `VPS_USER` - Usuario SSH (generalmente `root`)
- [ ] `DB_USERNAME` - Usuario PostgreSQL
- [ ] `DB_PASSWORD` - Contraseña PostgreSQL
- [ ] `DB_DATABASE` - Nombre de la base de datos
- [ ] `JWT_SECRET` - Secret JWT (mínimo 32 caracteres)

### 🟡 Secrets Opcionales (tienen valores por defecto)

- [ ] `DB_PORT` - Puerto PostgreSQL (default: `5432`)
- [ ] `JWT_EXPIRES_IN` - Expiración token (default: `1d`)
- [ ] `NEXT_PUBLIC_API_URL_DEV` - URL API desarrollo
- [ ] `NEXT_PUBLIC_API_URL_PRODUCTION` - URL API producción

**Para verificar/agregar secrets:**
1. Ve a: `Settings > Secrets and variables > Actions`
2. Revisa cada secret listado arriba
3. Agrega los que falten

---

## 🧪 Paso 1: Ejecutar Test SSH Connection

**Antes de hacer el deploy completo, prueba la conexión SSH:**

1. Ve a: `Actions > Test SSH Connection`
2. Click en `Run workflow`
3. Selecciona la rama (`main` o `develop`)
4. Click en `Run workflow`
5. Observa el paso de conexión SSH

**Resultados esperados:**

- ✅ **Si pasa**: La conexión SSH funciona correctamente
- ❌ **Si falla**: Revisa los logs para ver el error específico

**Errores comunes:**

- `Permission denied`: Contraseña incorrecta → Verifica `VPS_SSH_PASSWORD`
- `Connection timeout`: Problema de red → Verifica `VPS_HOST` y firewall
- `Host key verification failed`: Normal en primera conexión (el workflow lo maneja automáticamente)

---

## 🚀 Paso 2: Ejecutar Deployment Completo

**Una vez que el test SSH funcione:**

1. Ve a: `Actions > Deploy to Hostinger VPS`
2. Click en `Run workflow`
3. Selecciona:
   - **Branch**: `main` (producción) o `develop` (desarrollo)
   - **Environment**: `production` o `development`
   - **Skip tests**: Dejar desmarcado (recomendado)
4. Click en `Run workflow`

---

## 📊 Qué Esperar Durante el Deployment

El workflow ejecutará estos pasos en orden:

### 1. ✅ Integrity Check (Pre-Deployment)
- [ ] Checkout code
- [ ] Setup Node.js
- [ ] Install dependencies
- [ ] Run linting (API y Portal)
- [ ] Run tests with coverage
- [ ] Verify builds (API y Portal)

**Tiempo estimado**: 5-10 minutos

### 2. 🔐 SSH Connection
- [ ] Setup SSH (si hay SSH Key)
- [ ] Install SSH tools
- [ ] Test SSH connection
- [ ] Debug Environment Variables

**Tiempo estimado**: 30 segundos - 1 minuto

### 3. 🚀 Deploy to VPS
- [ ] Prepare deployment script
- [ ] Copy deployment script to VPS
- [ ] Execute deployment on VPS

**Tiempo estimado**: 2-5 minutos

### 4. 🔍 Verify Deployment
- [ ] Check API health
- [ ] Check Portal health

**Tiempo estimado**: 1 minuto

### 5. 📢 Notify
- [ ] Send notification (si está configurado)

**Tiempo estimado**: 10 segundos

**Tiempo total estimado**: 8-17 minutos

---

## ✅ Verificación Post-Deployment

**Después de que el workflow termine exitosamente:**

### 1. Verificar Servicios en el VPS

```bash
# Conectarte al VPS
ssh root@TU_VPS_IP

# Verificar contenedores Docker
docker ps

# Deberías ver:
# - requirements-api (API)
# - requirements-portal (Portal)
# - requirements-db (PostgreSQL)
```

### 2. Verificar Health Checks

```bash
# API Health
curl http://TU_VPS_IP:3000/api/v1/health/liveness

# Portal
curl http://TU_VPS_IP:4200
```

### 3. Verificar Logs

```bash
# En el VPS
cd /opt/modules/requirements-management

# Ver logs de Docker Compose
docker-compose logs -f

# O logs específicos
docker-compose logs api
docker-compose logs portal
```

---

## 🔒 Seguridad: Migrar a SSH Key (Recomendado)

**⚠️ Importante**: Usar contraseña SSH es menos seguro. Una vez que el deployment funcione, deberías migrar a SSH Key.

### Pasos para Migrar:

1. **Generar clave SSH dedicada:**
```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy
```

2. **Agregar clave pública al VPS:**
```bash
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub root@TU_VPS_IP
```

3. **Probar conexión:**
```bash
ssh -i ~/.ssh/github_actions_deploy root@TU_VPS_IP
```

4. **Agregar clave privada a GitHub Secrets:**
```bash
cat ~/.ssh/github_actions_deploy
# Copia TODO el contenido y agrégalo como VPS_SSH_KEY
```

5. **Eliminar contraseña de GitHub Secrets** (opcional pero recomendado)

6. **Probar workflow nuevamente** - debería usar SSH Key automáticamente

**Ver guía completa**: [MEJORES_PRACTICAS_SSH_GITHUB_ACTIONS.md](MEJORES_PRACTICAS_SSH_GITHUB_ACTIONS.md)

---

## 🆘 Troubleshooting

### Error: "Permission denied"

**Causa**: Contraseña incorrecta o usuario incorrecto

**Solución**:
1. Verifica `VPS_SSH_PASSWORD` en GitHub Secrets
2. Verifica `VPS_USER` (debe ser `root` o el usuario correcto)
3. Prueba la contraseña manualmente: `ssh root@TU_VPS_IP`

### Error: "Connection timeout"

**Causa**: Problema de red o firewall

**Solución**:
1. Verifica `VPS_HOST` es correcto
2. Verifica que el puerto 22 esté abierto
3. Verifica firewall del VPS

### Error: "sshpass: command not found"

**Causa**: `sshpass` no está instalado en el runner

**Solución**: El workflow ya instala `sshpass` automáticamente, pero si falla:
- El workflow debería instalarlo automáticamente
- Si persiste, verifica los logs del paso "Install SSH tools"

### Error en Integrity Check

**Causa**: Problemas con linting, tests o builds

**Solución**:
1. Revisa los logs del paso específico que falló
2. Corrige los errores de linting/tests localmente
3. Haz commit y push de los cambios
4. Ejecuta el workflow nuevamente

---

## 📚 Referencias

- [Configurar Secrets en GitHub](CONFIGURAR_SECRETS_GITHUB.md)
- [Mejores Prácticas SSH](MEJORES_PRACTICAS_SSH_GITHUB_ACTIONS.md)
- [Solución Paso a Paso SSH](PASO_A_PASO_SOLUCION_SSH.md)

---

## ✅ Checklist Final

Antes de ejecutar el workflow:

- [x] `VPS_SSH_PASSWORD` configurado ✅
- [ ] `VPS_HOST` configurado
- [ ] `VPS_USER` configurado
- [ ] `DB_USERNAME` configurado
- [ ] `DB_PASSWORD` configurado
- [ ] `DB_DATABASE` configurado
- [ ] `JWT_SECRET` configurado (mínimo 32 caracteres)
- [ ] Test SSH Connection ejecutado y pasó ✅
- [ ] Listo para ejecutar deployment completo

---

**¡Con la contraseña configurada, deberías poder hacer el deployment ahora!** 🚀

**Próximo paso**: Ejecuta el workflow "Deploy to Hostinger VPS" desde GitHub Actions.

