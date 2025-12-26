# 🔧 Solución Definitiva: Permission Denied (publickey,password)

## ❌ Problema

El workflow detecta correctamente `VPS_SSH_PASSWORD` pero SSH rechaza la autenticación con:

```
Permission denied (publickey,password)
```

## 🔍 Causa Principal

**La contraseña en GitHub Secrets NO coincide con la contraseña real del servidor.**

## ✅ Solución Paso a Paso

### Paso 1: Verificar Contraseña Manualmente

**Conéctate manualmente al servidor para obtener la contraseña exacta:**

```bash
ssh root@72.60.63.240
```

**Importante:**

- Anota la contraseña EXACTA que funciona
- Verifica mayúsculas/minúsculas
- Verifica caracteres especiales
- No agregues espacios al inicio o final

### Paso 2: Actualizar Secret en GitHub

1. **Ve a GitHub:**

   - Tu repositorio → **Settings** → **Secrets and variables** → **Actions**

2. **Busca `VPS_SSH_PASSWORD`:**

   - Si existe, click en él
   - Click en **Update**
   - Si NO existe, click en **New repository secret**

3. **Ingresa la contraseña:**
   - **Name:** `VPS_SSH_PASSWORD`
   - **Secret:** Pega la contraseña EXACTA que funciona manualmente
   - **IMPORTANTE:**
     - Sin espacios al inicio
     - Sin espacios al final
     - Copia y pega directamente (no escribas manualmente)
   - Click en **Update secret** o **Add secret**

### Paso 3: Verificar Otros Secrets

Asegúrate de que estos secrets también estén correctos:

- ✅ `VPS_HOST` = `72.60.63.240`
- ✅ `VPS_USER` = `root` (o el usuario que funciona manualmente)

### Paso 4: Probar con Test SSH Connection

Antes de hacer el deployment completo:

1. Ve a **Actions** → **Test SSH Connection**
2. Click en **Run workflow**
3. Revisa los logs

**Si funciona:** El problema estaba en la contraseña
**Si NO funciona:** Revisa el Paso 5

### Paso 5: Verificar Usuario SSH

Si la contraseña es correcta pero sigue fallando:

1. **Prueba con diferentes usuarios:**

   ```bash
   ssh root@72.60.63.240
   ssh admin@72.60.63.240
   ssh tu_usuario@72.60.63.240
   ```

2. **Identifica qué usuario funciona**

3. **Actualiza `VPS_USER` en GitHub Secrets:**
   - Ve a: Settings > Secrets > Actions
   - Busca: `VPS_USER`
   - Actualiza con el usuario que funciona
   - O déjalo vacío para usar el default `root`

## 🧪 Prueba Rápida Local

Si tienes `sshpass` instalado localmente, prueba:

```bash
# Reemplaza con tus valores reales
VPS_HOST="72.60.63.240"
VPS_USER="root"
VPS_PASSWORD="TU_CONTRASEÑA_EXACTA_AQUI"

sshpass -p "$VPS_PASSWORD" \
  ssh -o StrictHostKeyChecking=no \
      -o PreferredAuthentications=password \
      -o PubkeyAuthentication=no \
      "$VPS_USER@$VPS_HOST" \
      "echo 'Connection successful'"
```

**Si esto funciona:** La contraseña es correcta, el problema está en GitHub Actions
**Si esto NO funciona:** La contraseña es incorrecta

## 🔍 Verificación Adicional

### Verificar que el Secret se Guardó Correctamente

1. Ve a: Settings > Secrets > Actions
2. Busca: `VPS_SSH_PASSWORD`
3. Verifica que existe
4. **Nota:** GitHub no te permite ver el valor por seguridad, pero puedes actualizarlo

### Verificar Espacios Extra

Cuando actualices el secret:

- **NO copies espacios** antes o después de la contraseña
- **Copia directamente** desde donde funciona manualmente
- **Pega directamente** en GitHub Secrets

### Verificar Caracteres Especiales

Si tu contraseña tiene caracteres especiales:

- Asegúrate de copiarlos correctamente
- Algunos caracteres pueden necesitar escape en bash, pero en GitHub Secrets se guardan tal cual

## 📋 Checklist Final

Antes de ejecutar el workflow nuevamente:

- [ ] Puedo conectarme manualmente: `ssh root@72.60.63.240`
- [ ] La contraseña que uso manualmente es la misma que actualicé en GitHub Secrets
- [ ] `VPS_SSH_PASSWORD` en GitHub Secrets NO tiene espacios extra
- [ ] `VPS_USER` en GitHub Secrets es correcto (`root` generalmente)
- [ ] `VPS_HOST` en GitHub Secrets es correcto (`72.60.63.240`)
- [ ] Probé con "Test SSH Connection" y funciona

## 💡 Consejos Importantes

1. **Copia y pega directamente:** No escribas la contraseña manualmente en GitHub Secrets
2. **Sin espacios:** Asegúrate de no copiar espacios al inicio o final
3. **Misma contraseña:** Debe ser exactamente la misma que funciona manualmente
4. **Usuario correcto:** Verifica que `VPS_USER` sea el usuario que funciona

## 🚨 Si Nada Funciona

Si después de verificar todo lo anterior sigue fallando:

1. **Elimina y recrea el secret:**

   - Elimina `VPS_SSH_PASSWORD` completamente
   - Crea uno nuevo con la contraseña exacta

2. **Verifica la configuración del servidor:**

   ```bash
   ssh root@72.60.63.240
   cat /etc/ssh/sshd_config | grep -i password
   ```

   Debe mostrar: `PasswordAuthentication yes`

3. **Considera usar SSH keys:**
   - Genera una clave SSH
   - Copia la clave pública al servidor
   - Usa `VPS_SSH_KEY` en lugar de `VPS_SSH_PASSWORD`

## 🔗 Referencias

- [Verificar Contraseña SSH](VERIFICAR_CONTRASENA_SSH.md)
- [Diagnóstico Final SSH](DIAGNOSTICO_FINAL_SSH.md)
- [Solución Inmediata Error SSH](SOLUCION_INMEDIATA_ERROR_SSH.md)
