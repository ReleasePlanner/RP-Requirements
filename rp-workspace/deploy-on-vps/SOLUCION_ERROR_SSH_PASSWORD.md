# ✅ Solución: Error SSH Password Authentication

## ❌ Problema

El workflow intentaba usar claves SSH primero, y cuando fallaba, intentaba usar contraseña pero sin configurar correctamente `sshpass` y sin deshabilitar completamente el agente SSH.

**Error observado:**
```
debug1: Trying private key: /home/runner/.ssh/id_dsa
debug1: Next authentication method: password
debug1: read_passphrase: can't open /dev/tty: No such device or address
Permission denied, please try again.
```

## 🔍 Causa

1. El agente SSH se configuraba incluso cuando había contraseña configurada
2. SSH intentaba usar las claves del agente primero antes de intentar contraseña
3. Cuando intentaba usar contraseña, no tenía `sshpass` correctamente configurado
4. Las variables de entorno del agente SSH no se deshabilitaban completamente

## ✅ Solución Implementada

### Cambios Principales

1. **Usar outputs del step `check-ssh`** en lugar de verificar secrets directamente
2. **Deshabilitar completamente el agente SSH** cuando se usa contraseña:
   - `unset SSH_AUTH_SOCK`
   - `unset SSH_AGENT_PID`
   - `export SSH_AUTH_SOCK=""`
   - `export SSH_AGENT_PID=""`
   - `ssh-add -D` para eliminar claves del agente
3. **Agregar `IdentityFile=/dev/null`** para forzar que no use claves
4. **Instalar `sshpass`** si no está disponible
5. **Priorizar contraseña** usando outputs del step `check-ssh`

### Implementación

#### Paso "Test SSH connection"

```yaml
if [ "${{ steps.check-ssh.outputs.has_ssh_password }}" == "true" ]; then
  # Deshabilitar completamente el agente SSH
  unset SSH_AUTH_SOCK
  unset SSH_AGENT_PID
  export SSH_AUTH_SOCK=""
  export SSH_AGENT_PID=""
  ssh-add -D 2>/dev/null || true
  
  sshpass -p '${{ secrets.VPS_SSH_PASSWORD }}' \
    ssh -o PreferredAuthentications=password \
        -o PubkeyAuthentication=no \
        -o IdentityFile=/dev/null \
        ...
```

#### Paso "Copy deployment script"

```yaml
if [ "${{ steps.check-ssh.outputs.has_ssh_password }}" == "true" ]; then
  # Instalar sshpass si no está disponible
  which sshpass || (sudo apt-get update && sudo apt-get install -y sshpass)
  
  # Deshabilitar completamente el agente SSH
  unset SSH_AUTH_SOCK
  unset SSH_AGENT_PID
  export SSH_AUTH_SOCK=""
  export SSH_AGENT_PID=""
  ssh-add -D 2>/dev/null || true
  
  sshpass -p '${{ secrets.VPS_SSH_PASSWORD }}' \
    scp -o PreferredAuthentications=password \
        -o PubkeyAuthentication=no \
        -o IdentityFile=/dev/null \
        ...
```

#### Paso "Execute deployment"

Mismo patrón aplicado.

## 🔧 Opciones SSH Críticas

Cuando se usa contraseña, estas opciones son esenciales:

```bash
-o PreferredAuthentications=password  # Prioriza contraseña
-o PubkeyAuthentication=no             # Deshabilita claves públicas
-o PasswordAuthentication=yes           # Habilita contraseña
-o BatchMode=yes                       # Modo no interactivo
-o NumberOfPasswordPrompts=1           # Solo un intento
-o IdentitiesOnly=yes                  # Solo usa identidades especificadas
-o IdentityFile=/dev/null              # No usar archivos de identidad
```

## ✅ Resultado Esperado

Ahora el workflow:

1. ✅ Verifica si hay contraseña usando outputs del step `check-ssh`
2. ✅ Si hay contraseña, NO configura el agente SSH
3. ✅ Deshabilita completamente el agente SSH antes de usar contraseña
4. ✅ Elimina cualquier clave del agente
5. ✅ Usa `sshpass` con todas las opciones correctas
6. ✅ Fuerza el uso de contraseña con `IdentityFile=/dev/null`

## 🧪 Verificación

Después de estos cambios, el workflow debería:

- ✅ Conectarse usando contraseña directamente
- ✅ No intentar usar claves SSH primero
- ✅ No mostrar errores de "can't open /dev/tty"
- ✅ Completar el deployment exitosamente

## 📝 Notas Importantes

- Los outputs del step `check-ssh` se establecen como strings (`'true'` o `'false'`)
- Por eso comparamos con `== "true"` (con comillas)
- `sshpass` debe estar instalado antes de usarse
- `IdentityFile=/dev/null` fuerza que SSH no busque archivos de clave

## 🔗 Referencias

- [sshpass Documentation](https://linux.die.net/man/1/sshpass)
- [SSH Configuration Options](https://man.openbsd.org/ssh_config)
- [GitHub Actions: Setting output parameters](https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#setting-output-parameters)

