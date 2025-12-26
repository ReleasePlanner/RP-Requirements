# 📋 Próximos Pasos a Ejecutar

## ✅ Estado Actual

- ✅ Workflow configurado correctamente
- ✅ Detecta `VPS_SSH_PASSWORD` correctamente
- ✅ Intenta usar contraseña (no SSH key)
- ❌ SSH rechaza la autenticación ("Permission denied")

## 🎯 Próximos Pasos (En Orden)

### Paso 1: Verificar Contraseña Manualmente ⚠️ CRÍTICO

**Ejecuta esto en tu terminal local:**

```bash
ssh root@72.60.63.240
```

**Importante:**
- ✅ Si funciona: Anota la contraseña EXACTA que usaste
- ❌ Si NO funciona: Verifica que tengas acceso al servidor

**Resultado esperado:**
- Deberías poder conectarte al servidor
- Deberías ver el prompt del servidor

### Paso 2: Actualizar Secret en GitHub ⚠️ CRÍTICO

**Acción requerida:**

1. Ve a tu repositorio en GitHub
2. Click en **Settings**
3. En el menú lateral: **Secrets and variables** → **Actions**
4. Busca: `VPS_SSH_PASSWORD`
5. Click en el secret
6. Click en **Update**
7. **Pega la contraseña EXACTA** que funciona manualmente
8. **IMPORTANTE:**
   - Sin espacios al inicio
   - Sin espacios al final
   - Copia y pega directamente (no escribas)
9. Click en **Update secret**

**Si el secret NO existe:**
- Click en **New repository secret**
- **Name:** `VPS_SSH_PASSWORD`
- **Secret:** Tu contraseña exacta
- Click en **Add secret**

### Paso 3: Verificar Otros Secrets

**Asegúrate de que estos secrets estén configurados:**

#### Críticos:
- [ ] `VPS_HOST` = `72.60.63.240`
- [ ] `VPS_USER` = `root` (o tu usuario SSH)
- [ ] `VPS_SSH_PASSWORD` = (tu contraseña SSH exacta) ⚠️ **ACABAS DE ACTUALIZAR**
- [ ] `DB_USERNAME` = (usuario PostgreSQL)
- [ ] `DB_PASSWORD` = (contraseña PostgreSQL)
- [ ] `DB_DATABASE` = `requirements_db`
- [ ] `JWT_SECRET` = (mínimo 32 caracteres)

#### Opcionales:
- [ ] `DB_PORT` = `5432` (default)
- [ ] `JWT_EXPIRES_IN` = `1d` (default)

### Paso 4: Probar Conexión SSH Primero 🧪

**Antes de hacer el deployment completo:**

1. Ve a **Actions** en GitHub
2. Selecciona **Test SSH Connection**
3. Click en **Run workflow**
4. Click en **Run workflow** (botón verde)
5. Espera a que termine
6. Revisa los logs

**Resultado esperado:**
```
✅ SSH connection test successful
✅ Directory accessible
```

**Si funciona:** ✅ La contraseña es correcta, puedes proceder al deployment
**Si NO funciona:** ❌ Revisa el Paso 5

### Paso 5: Si Test SSH Connection Falla

**Verifica:**

1. **Contraseña:**
   - ¿Es exactamente la misma que funciona manualmente?
   - ¿Tiene espacios extra?
   - ¿Está escrita correctamente?

2. **Usuario:**
   - ¿`VPS_USER` es `root`?
   - ¿O necesitas otro usuario?

3. **Host:**
   - ¿`VPS_HOST` es `72.60.63.240`?
   - ¿Es correcto?

**Si todo está correcto pero sigue fallando:**
- Elimina y recrea el secret `VPS_SSH_PASSWORD`
- Prueba con un usuario diferente si es necesario

### Paso 6: Ejecutar Deployment Completo 🚀

**Solo después de que "Test SSH Connection" funcione:**

1. Ve a **Actions** en GitHub
2. Selecciona **Deploy to Hostinger VPS**
3. Click en **Run workflow**
4. Selecciona:
   - **Environment:** `development` o `production`
   - **Skip tests:** `false` (o `true` si quieres saltar tests)
5. Click en **Run workflow**
6. Espera a que termine
7. Revisa los logs

**Resultado esperado:**
```
✅ Deployment to Hostinger VPS successful!
```

## 📊 Checklist de Ejecución

Marca cada paso cuando lo completes:

- [ ] Paso 1: Verificar contraseña manualmente (`ssh root@72.60.63.240`)
- [ ] Paso 2: Actualizar `VPS_SSH_PASSWORD` en GitHub Secrets
- [ ] Paso 3: Verificar otros secrets están configurados
- [ ] Paso 4: Ejecutar "Test SSH Connection" en GitHub Actions
- [ ] Paso 5: Si falla, revisar y corregir
- [ ] Paso 6: Ejecutar "Deploy to Hostinger VPS" en GitHub Actions

## 🔍 Qué Buscar en los Logs

### Test SSH Connection - Éxito:
```
✅ VPS_SSH_PASSWORD is configured - WILL USE PASSWORD
🔑 Using SSH password authentication (prioritized)
✅ SSH connection test successful
✅ Directory accessible
```

### Test SSH Connection - Falla:
```
❌ SSH connection test failed with password
💡 Verify VPS_SSH_PASSWORD is correct in GitHub Secrets
```

### Deployment - Éxito:
```
✅ Deployment executed successfully
✅ Deployment to Hostinger VPS successful!
```

### Deployment - Falla:
```
❌ Failed to copy deployment script via SSH password
❌ Deployment to Hostinger VPS failed!
```

## 💡 Consejos

1. **Siempre prueba "Test SSH Connection" primero** antes del deployment completo
2. **Copia y pega la contraseña** directamente, no la escribas manualmente
3. **Sin espacios extra** al inicio o final de la contraseña
4. **Verifica el usuario** - generalmente es `root` pero puede ser diferente

## 🔗 Referencias

- [Solución Definitiva Permission Denied](SOLUCION_DEFINITIVA_PERMISSION_DENIED.md)
- [Verificar Contraseña SSH](VERIFICAR_CONTRASENA_SSH.md)
- [Diagnóstico Final SSH](DIAGNOSTICO_FINAL_SSH.md)

