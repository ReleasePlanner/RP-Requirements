# 🔍 Verificar Contraseña SSH Correcta

## ❌ Problema Actual

El workflow detecta correctamente que `VPS_SSH_PASSWORD` está configurado, pero aún así falla con "Permission denied". Esto puede significar:

1. **La contraseña es incorrecta** en GitHub Secrets
2. **El usuario SSH es incorrecto** (`VPS_USER`)
3. **El servidor requiere autenticación adicional**

## ✅ Pasos para Verificar

### Paso 1: Verificar Contraseña Manualmente

Conéctate manualmente al servidor para verificar que la contraseña funciona:

```bash
ssh root@72.60.63.240
```

**Si funciona:**
- ✅ La contraseña es correcta
- ✅ El problema está en el workflow

**Si NO funciona:**
- ❌ La contraseña en GitHub Secrets es incorrecta
- ❌ Actualiza `VPS_SSH_PASSWORD` en GitHub Secrets

### Paso 2: Verificar Usuario SSH

Confirma qué usuario SSH estás usando:

```bash
# Probar con root
ssh root@72.60.63.240

# O si usas otro usuario
ssh tu_usuario@72.60.63.240
```

**Verifica en GitHub Secrets:**
- `VPS_USER` debe coincidir con el usuario que funciona manualmente

### Paso 3: Verificar Contraseña en GitHub Secrets

1. Ve a: **Settings > Secrets and variables > Actions**
2. Busca: `VPS_SSH_PASSWORD`
3. Click en el secret para verlo (si GitHub lo permite) o actualízalo
4. **Verifica:**
   - ✅ No tiene espacios al inicio o final
   - ✅ Está escrita correctamente
   - ✅ Coincide con la contraseña que funciona manualmente

### Paso 4: Probar con sshpass Localmente

Si tienes `sshpass` instalado localmente, prueba:

```bash
sshpass -p 'TU_CONTRASEÑA' ssh root@72.60.63.240 "echo 'test'"
```

Si esto funciona, el problema está en cómo GitHub Actions está usando la contraseña.

## 🔧 Soluciones Posibles

### Solución 1: Actualizar Contraseña en GitHub Secrets

Si la contraseña es incorrecta:

1. Ve a: **Settings > Secrets > Actions**
2. Busca: `VPS_SSH_PASSWORD`
3. Click en el secret
4. Click en **Update**
5. Ingresa la contraseña correcta
6. Click en **Update secret**

### Solución 2: Verificar Usuario SSH

Si el usuario es incorrecto:

1. Verifica qué usuario funciona manualmente
2. Actualiza `VPS_USER` en GitHub Secrets si es necesario
3. O déjalo vacío para usar el default `root`

### Solución 3: Verificar Configuración del Servidor

El servidor podría tener restricciones. Verifica:

```bash
# Conectarte al servidor
ssh root@72.60.63.240

# Ver configuración SSH
cat /etc/ssh/sshd_config | grep -i password
cat /etc/ssh/sshd_config | grep -i pubkey
```

**Busca:**
- `PasswordAuthentication yes` - Debe estar en `yes`
- `PubkeyAuthentication yes` - Puede estar en `yes` o `no`

## 🧪 Prueba Rápida

Ejecuta este comando localmente para verificar:

```bash
# Reemplaza con tus valores reales
VPS_HOST="72.60.63.240"
VPS_USER="root"
VPS_PASSWORD="TU_CONTRASEÑA_AQUI"

sshpass -p "$VPS_PASSWORD" \
  ssh -o StrictHostKeyChecking=no \
      -o PreferredAuthentications=password \
      -o PubkeyAuthentication=no \
      -o PasswordAuthentication=yes \
      "$VPS_USER@$VPS_HOST" \
      "echo 'Connection successful'"
```

**Si esto funciona:**
- ✅ La contraseña es correcta
- ✅ El problema está en cómo GitHub Actions la está usando

**Si esto NO funciona:**
- ❌ La contraseña es incorrecta
- ❌ O el servidor tiene restricciones

## 📋 Checklist de Verificación

- [ ] Puedo conectarme manualmente con: `ssh root@72.60.63.240`
- [ ] La contraseña que uso manualmente es la misma que está en GitHub Secrets
- [ ] `VPS_USER` en GitHub Secrets coincide con el usuario que funciona manualmente
- [ ] `VPS_HOST` en GitHub Secrets es correcto (`72.60.63.240`)
- [ ] No hay espacios extra en `VPS_SSH_PASSWORD` en GitHub Secrets
- [ ] El servidor permite autenticación por contraseña

## 💡 Recomendación

Si después de verificar todo lo anterior sigue fallando:

1. **Actualiza la contraseña en GitHub Secrets** (aunque creas que es correcta)
2. **Elimina espacios extra** al inicio/final
3. **Verifica que el usuario sea correcto** (`root` generalmente)
4. **Ejecuta el workflow nuevamente**

## 🔗 Referencias

- [Verificar Secrets en GitHub](VERIFICAR_SECRETS_GITHUB.md)
- [Solución Inmediata Error SSH](SOLUCION_INMEDIATA_ERROR_SSH.md)

