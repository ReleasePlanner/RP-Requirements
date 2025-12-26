# 🔐 Verificar Contraseña en GitHub Secrets

## 🎯 Objetivo

Verificar que la contraseña SSH (`VPS_SSH_PASSWORD`) esté configurada correctamente en GitHub Secrets.

## 📋 Pasos para Verificar

### Opción 1: Usar el Workflow de Verificación (Recomendado)

1. **Ve a GitHub Actions:**
   - Abre tu repositorio en GitHub
   - Click en la pestaña "Actions"

2. **Ejecuta el workflow de verificación:**
   - Busca "Verify SSH Password Configuration" en la lista de workflows
   - Click en "Run workflow"
   - Click en el botón verde "Run workflow"

3. **Revisa los resultados:**
   - El workflow mostrará:
     - ✅ Si la contraseña está configurada
     - 📏 Longitud de la contraseña
     - 🔤 Primer y último carácter (sin mostrar la contraseña completa)
     - 🔣 Caracteres especiales presentes
     - ⚠️ Advertencias si hay problemas
     - 🧪 Prueba de conexión SSH si todo está correcto

### Opción 2: Verificar Manualmente

1. **Ve a GitHub Secrets:**
   - Abre tu repositorio en GitHub
   - Ve a: `Settings` → `Secrets and variables` → `Actions`

2. **Busca VPS_SSH_PASSWORD:**
   - Debería aparecer en la lista de secrets
   - Si no está, necesitas crearlo

3. **Verifica que existe:**
   - ✅ Si aparece en la lista: está configurado
   - ❌ Si no aparece: necesitas crearlo

**Nota:** GitHub no muestra el valor del secret por seguridad, solo confirma que existe.

## 🔧 Actualizar la Contraseña

Si necesitas actualizar o crear la contraseña:

### 1. Crear/Actualizar el Secret

1. Ve a: `Settings` → `Secrets and variables` → `Actions`
2. Si existe `VPS_SSH_PASSWORD`:
   - Click en el secret
   - Click en "Update"
3. Si no existe:
   - Click en "New repository secret"

### 2. Configurar el Secret

- **Name:** `VPS_SSH_PASSWORD`
- **Value:** `Aar-Beto-2026`
  - ⚠️ **IMPORTANTE:** 
    - Sin espacios al inicio o final
    - Sin comillas alrededor
    - Exactamente como está: `Aar-Beto-2026`

### 3. Guardar

- Click "Add secret" (si es nuevo) o "Update secret" (si existe)

## ✅ Verificación Esperada

### Contraseña Correcta: `Aar-Beto-2026`

El workflow de verificación debería mostrar:

```
✅ VPS_SSH_PASSWORD está configurado en GitHub Secrets
📏 Longitud de la contraseña: 13 caracteres
🔤 Primer carácter: A***
🔤 Último carácter: ***6
🔣 Caracteres especiales: - (guión)
✅ No hay espacios al inicio o final
✅ Longitud coincide con la esperada (13 caracteres)
✅ Primer carácter correcto (A)
✅ Último carácter correcto (6)
✅ La contraseña parece estar configurada correctamente
```

### Si Hay Problemas

El workflow mostrará advertencias específicas:

- ❌ **Longitud incorrecta:** La contraseña no tiene 13 caracteres
- ❌ **Primer carácter incorrecto:** No empieza con 'A'
- ❌ **Último carácter incorrecto:** No termina con '6'
- ⚠️ **Tiene espacios extra:** Hay espacios al inicio o final

## 🧪 Probar la Contraseña

### Método 1: Workflow de Verificación

El workflow "Verify SSH Password Configuration" probará automáticamente la conexión SSH si la contraseña parece correcta.

### Método 2: Workflow de Test SSH

1. Ve a "Actions" → "Test SSH Connection"
2. Click "Run workflow"
3. Revisa los logs para ver si la conexión funciona

### Método 3: Prueba Manual Local

```bash
# Conectarte manualmente
ssh root@72.60.63.240

# Usa la contraseña: Aar-Beto-2026
# Si funciona, esa es la contraseña correcta para GitHub Secrets
```

## 🚨 Troubleshooting

### Error: "VPS_SSH_PASSWORD NO está configurado"

**Solución:**
1. Ve a Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `VPS_SSH_PASSWORD`
4. Value: `Aar-Beto-2026`
5. Click "Add secret"

### Error: "Longitud incorrecta"

**Causa:** La contraseña tiene caracteres de más o de menos

**Solución:**
1. Verifica manualmente: `ssh root@72.60.63.240`
2. Usa la contraseña exacta que funciona
3. Debería ser exactamente: `Aar-Beto-2026` (13 caracteres)
4. Actualiza el secret en GitHub

### Error: "Primer/Último carácter incorrecto"

**Causa:** La contraseña es diferente a la esperada

**Solución:**
1. Verifica la contraseña manualmente
2. Asegúrate de copiar exactamente: `Aar-Beto-2026`
3. No agregues espacios ni comillas
4. Actualiza el secret

### Error: "Tiene espacios extra"

**Causa:** Hay espacios al inicio o final de la contraseña

**Solución:**
1. Copia la contraseña sin espacios: `Aar-Beto-2026`
2. No agregues espacios al copiar/pegar
3. Actualiza el secret

### La Contraseña Funciona Manualmente pero No en GitHub Actions

**Causa:** Caracteres especiales o espacios en GitHub Secrets

**Solución:**
1. Copia la contraseña directamente desde donde funciona
2. Pégala en GitHub Secrets sin modificar
3. No agregues comillas ni espacios
4. Verifica con el workflow de verificación

## 📝 Checklist de Verificación

Antes de ejecutar el deployment, verifica:

- [ ] `VPS_SSH_PASSWORD` existe en GitHub Secrets
- [ ] La contraseña tiene 13 caracteres
- [ ] Empieza con 'A' y termina con '6'
- [ ] No tiene espacios al inicio o final
- [ ] Contiene un guión (-) como carácter especial
- [ ] El workflow de verificación pasa todas las pruebas
- [ ] El workflow "Test SSH Connection" funciona

## 🔗 Workflows Relacionados

- **Verify SSH Password Configuration** - Verifica la contraseña en GitHub Secrets
- **Test SSH Connection** - Prueba la conexión SSH con la contraseña
- **Deploy to Hostinger VPS** - Deployment completo usando la contraseña

## 📚 Archivos Relacionados

- [Verificar Contraseña GitHub](VERIFICAR_CONTRASEÑA_GITHUB.md)
- [Comandos Rápidos Servidor](COMANDOS_RAPIDOS_SERVIDOR.md)
- [Solución Definitiva Permission Denied](SOLUCION_DEFINITIVA_PERMISSION_DENIED.md)

