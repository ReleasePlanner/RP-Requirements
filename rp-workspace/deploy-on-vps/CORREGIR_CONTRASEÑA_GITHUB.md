# 🔧 Corregir Contraseña en GitHub Secrets

## ⚠️ Problema Actual

El workflow "Verify SSH Password Configuration" está fallando porque la contraseña en GitHub Secrets no es correcta o tiene caracteres mal codificados.

## ✅ Solución Paso a Paso

### Paso 1: Verificar Contraseña Manualmente

**Ejecuta en tu terminal local:**

```bash
ssh root@72.60.63.240
```

**Cuando te pida la contraseña, ingresa:** `Aar-Beto-2026`

**Si funciona:** ✅ Esta es la contraseña correcta
**Si no funciona:** ❌ Necesitas obtener la contraseña correcta del administrador del servidor

---

### Paso 2: Copiar Contraseña Exacta

**IMPORTANTE:** Copia la contraseña EXACTA que funciona manualmente.

**La contraseña debería ser:**
```
Aar-Beto-2026
```

**Verifica que:**
- ✅ Tiene exactamente 13 caracteres
- ✅ Empieza con `A` (mayúscula)
- ✅ Termina con `6` (número)
- ✅ Tiene un guión `-` en el medio
- ✅ NO tiene espacios al inicio o final
- ✅ NO tiene comillas alrededor

---

### Paso 3: Actualizar GitHub Secrets

1. **Ve a tu repositorio en GitHub**

2. **Ve a Settings:**
   - Click en "Settings" (arriba del repositorio)
   - En el menú lateral izquierdo, busca "Secrets and variables"
   - Click en "Actions"

3. **Busca VPS_SSH_PASSWORD:**
   - Si existe: Click en el secret
   - Si no existe: Click en "New repository secret"

4. **Configura el Secret:**
   - **Name:** `VPS_SSH_PASSWORD` (exactamente así)
   - **Value:** `Aar-Beto-2026` (sin espacios, sin comillas)
     - ⚠️ **NO agregues espacios** al inicio o final
     - ⚠️ **NO agregues comillas** alrededor
     - ⚠️ **Copia exactamente** como está arriba

5. **Guarda:**
   - Si es nuevo: Click "Add secret"
   - Si existe: Click "Update secret"

---

### Paso 4: Verificar que se Guardó Correctamente

**GitHub no muestra el valor del secret por seguridad**, pero puedes verificar:

1. El secret debería aparecer en la lista de "Repository secrets"
2. Debería mostrar "Updated" con fecha reciente
3. El nombre debería ser exactamente: `VPS_SSH_PASSWORD`

---

### Paso 5: Ejecutar Workflow de Verificación

1. **Ve a Actions:**
   - Click en la pestaña "Actions" en GitHub

2. **Ejecuta el workflow:**
   - Busca "Verify SSH Password Configuration"
   - Click en "Run workflow"
   - Click en el botón verde "Run workflow"

3. **Revisa los resultados:**
   - Debería mostrar: ✅ La contraseña funciona correctamente
   - Si falla, revisa los logs para ver qué está mal

---

## 🔍 Troubleshooting Específico

### Error: "Permission denied"

**Causa:** La contraseña es incorrecta

**Solución:**
1. Verifica manualmente: `ssh root@72.60.63.240`
2. Usa la contraseña exacta que funciona
3. Copia esa contraseña EXACTA
4. Actualiza `VPS_SSH_PASSWORD` en GitHub Secrets

### Error: "Longitud incorrecta"

**Causa:** La contraseña tiene caracteres de más o de menos

**Solución:**
1. La contraseña debería tener exactamente 13 caracteres
2. Verifica manualmente cuántos caracteres tiene
3. Actualiza el secret con la longitud correcta

### Error: "Primer/Último carácter incorrecto"

**Causa:** La contraseña es diferente a la esperada

**Solución:**
1. Verifica manualmente la contraseña
2. Debería empezar con `A` y terminar con `6`
3. Si es diferente, usa la contraseña exacta que funciona

### La Contraseña Funciona Manualmente pero No en GitHub

**Causa:** Caracteres especiales o espacios en GitHub Secrets

**Solución:**
1. Copia la contraseña directamente desde donde funciona
2. Pégala en GitHub Secrets sin modificar
3. NO agregues comillas ni espacios
4. Verifica que sea exactamente igual

---

## 📋 Checklist de Verificación

Antes de ejecutar el workflow, verifica:

- [ ] La contraseña funciona manualmente: `ssh root@72.60.63.240`
- [ ] La contraseña tiene 13 caracteres
- [ ] Empieza con `A` y termina con `6`
- [ ] Tiene un guión `-` en el medio
- [ ] NO tiene espacios al inicio o final
- [ ] NO tiene comillas alrededor
- [ ] `VPS_SSH_PASSWORD` existe en GitHub Secrets
- [ ] El secret fue actualizado recientemente

---

## 🎯 Contraseña Esperada

**Formato correcto:**
```
Aar-Beto-2026
```

**Características:**
- Longitud: 13 caracteres
- Primer carácter: `A` (mayúscula)
- Último carácter: `6` (número)
- Caracteres especiales: `-` (guión)
- Sin espacios ni comillas

---

## ✅ Después de Corregir

Una vez que actualices la contraseña correctamente:

1. ✅ Ejecuta "Verify SSH Password Configuration"
2. ✅ Debería pasar todas las pruebas
3. ✅ Debería mostrar "✅ La contraseña funciona correctamente"
4. ✅ Luego ejecuta "Test SSH Connection"
5. ✅ Finalmente ejecuta el deployment completo

---

## 🆘 Si Sigue Fallando

Si después de seguir todos los pasos sigue fallando:

1. **Verifica la contraseña manualmente de nuevo:**
   ```bash
   ssh root@72.60.63.240
   ```

2. **Copia la contraseña carácter por carácter:**
   - Escribe cada carácter manualmente
   - No uses copiar/pegar si hay problemas

3. **Verifica que no haya caracteres ocultos:**
   - Usa un editor de texto plano
   - Verifica cada carácter

4. **Contacta al administrador del servidor:**
   - Si la contraseña cambió, necesitas la nueva
   - Verifica que el usuario sea correcto (`root`)

---

## 📚 Archivos Relacionados

- [Verificar Contraseña GitHub Secrets](VERIFICAR_CONTRASEÑA_GITHUB_SECRETS.md)
- [Próximos Pasos Ejecutar](PROXIMOS_PASOS_EJECUTAR.md)
- [Solución Definitiva Permission Denied](SOLUCION_DEFINITIVA_PERMISSION_DENIED.md)

---

**¡Sigue estos pasos cuidadosamente y el problema debería resolverse! 🔧**

