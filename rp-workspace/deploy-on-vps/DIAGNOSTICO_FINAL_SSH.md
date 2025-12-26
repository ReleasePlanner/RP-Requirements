# 🔍 Diagnóstico Final: Error SSH Permission Denied

## 📊 Análisis del Error

### ✅ Lo que está funcionando:
- ✅ `VPS_SSH_PASSWORD` está configurado en GitHub Secrets
- ✅ El workflow lo detecta correctamente
- ✅ Está intentando usar contraseña (no SSH key)
- ✅ `sshpass` está instalado y disponible
- ✅ Las opciones SSH están configuradas correctamente

### ❌ El problema:
- ❌ `Permission denied (publickey,password)` - SSH rechaza la autenticación
- ❌ Aunque está usando contraseña, el servidor la rechaza

## 🔍 Causas Posibles

### 1. Contraseña Incorrecta (Más Probable) ⚠️

**Síntoma:** El error "Permission denied" sugiere que la contraseña es incorrecta.

**Solución:**
1. Prueba conectarte manualmente:
   ```bash
   ssh root@72.60.63.240
   ```
2. Si funciona manualmente pero no en GitHub Actions:
   - La contraseña en GitHub Secrets puede tener espacios extra
   - O puede estar escrita incorrectamente
3. Actualiza `VPS_SSH_PASSWORD` en GitHub Secrets:
   - Ve a: Settings > Secrets > Actions
   - Busca: `VPS_SSH_PASSWORD`
   - Click en Update
   - Ingresa la contraseña exacta (sin espacios extra)
   - Click en Update secret

### 2. Usuario SSH Incorrecto

**Síntoma:** El usuario `VPS_USER` no coincide con el usuario del servidor.

**Solución:**
1. Verifica qué usuario funciona manualmente:
   ```bash
   ssh root@72.60.63.240
   # O
   ssh otro_usuario@72.60.63.240
   ```
2. Actualiza `VPS_USER` en GitHub Secrets si es necesario
3. O déjalo vacío para usar el default `root`

### 3. Servidor Deshabilitó Autenticación por Contraseña

**Síntoma:** El servidor solo acepta claves SSH.

**Solución:**
1. Conéctate al servidor manualmente
2. Verifica la configuración SSH:
   ```bash
   cat /etc/ssh/sshd_config | grep -i password
   ```
3. Busca: `PasswordAuthentication yes`
4. Si está en `no`, cámbialo a `yes`:
   ```bash
   sudo nano /etc/ssh/sshd_config
   # Cambiar: PasswordAuthentication yes
   sudo systemctl restart sshd
   ```

## 🧪 Pruebas de Diagnóstico

### Prueba 1: Conexión Manual
```bash
ssh root@72.60.63.240
```
**Si funciona:** La contraseña es correcta, el problema está en GitHub Actions
**Si NO funciona:** La contraseña es incorrecta o el usuario es incorrecto

### Prueba 2: Con sshpass Localmente
```bash
sshpass -p 'TU_CONTRASEÑA' ssh root@72.60.63.240 "echo 'test'"
```
**Si funciona:** La contraseña es correcta
**Si NO funciona:** La contraseña es incorrecta

### Prueba 3: Verificar Secret en GitHub
1. Ve a: Settings > Secrets > Actions
2. Busca: `VPS_SSH_PASSWORD`
3. Verifica:
   - ✅ Existe
   - ✅ No tiene espacios al inicio/final
   - ✅ Está escrita correctamente

## 🔧 Solución Paso a Paso

### Paso 1: Verificar Contraseña Manualmente
```bash
ssh root@72.60.63.240
```
Anota la contraseña exacta que funciona.

### Paso 2: Actualizar Secret en GitHub
1. Ve a: **Settings > Secrets > Actions**
2. Busca: `VPS_SSH_PASSWORD`
3. Click en el secret
4. Click en **Update**
5. Ingresa la contraseña exacta (sin espacios extra)
6. Click en **Update secret**

### Paso 3: Verificar Otros Secrets
- ✅ `VPS_HOST` = `72.60.63.240`
- ✅ `VPS_USER` = `root` (o tu usuario SSH)

### Paso 4: Ejecutar Workflow Nuevamente
1. Ve a: **Actions > Deploy to Hostinger VPS**
2. Click en **Run workflow**
3. Revisa los logs

## 📋 Checklist de Verificación

- [ ] Puedo conectarme manualmente: `ssh root@72.60.63.240`
- [ ] La contraseña que uso manualmente es la misma que está en GitHub Secrets
- [ ] `VPS_SSH_PASSWORD` en GitHub Secrets no tiene espacios extra
- [ ] `VPS_USER` en GitHub Secrets es correcto (`root`)
- [ ] `VPS_HOST` en GitHub Secrets es correcto (`72.60.63.240`)
- [ ] El servidor permite autenticación por contraseña

## 💡 Recomendación Final

**Si después de verificar todo lo anterior sigue fallando:**

1. **Elimina y recrea el secret `VPS_SSH_PASSWORD`:**
   - Elimina el secret existente
   - Crea uno nuevo con la contraseña exacta
   - Sin espacios al inicio o final

2. **Verifica la contraseña caracter por caracter:**
   - Asegúrate de que sea exactamente la misma que funciona manualmente
   - Verifica mayúsculas/minúsculas
   - Verifica caracteres especiales

3. **Prueba con un usuario diferente:**
   - Si `root` no funciona, prueba con otro usuario
   - Actualiza `VPS_USER` en GitHub Secrets

## 🔗 Referencias

- [Verificar Contraseña SSH](VERIFICAR_CONTRASENA_SSH.md)
- [Solución Inmediata Error SSH](SOLUCION_INMEDIATA_ERROR_SSH.md)
- [Verificar Secrets en GitHub](VERIFICAR_SECRETS_GITHUB.md)

