# 🔧 Instalar sshpass en Windows

## ⚠️ Problema

El script de test SSH requiere `sshpass` para automatizar la autenticación SSH con contraseña. En Windows, `sshpass` no está disponible por defecto.

## 📋 Soluciones Disponibles

### Opción 1: Usar WSL (Recomendado) ⭐

**Ventajas:**
- ✅ Instalación más simple
- ✅ Funciona igual que en Linux
- ✅ Compatible con todos los scripts

**Pasos:**

1. **Instalar WSL** (si no lo tienes):
   ```powershell
   wsl --install
   ```
   Reinicia tu computadora después de la instalación.

2. **Abrir WSL** y actualizar paquetes:
   ```bash
   sudo apt update
   ```

3. **Instalar sshpass**:
   ```bash
   sudo apt install sshpass -y
   ```

4. **Verificar instalación**:
   ```bash
   sshpass -V
   ```

5. **Ejecutar el script desde WSL**:
   ```bash
   cd /mnt/c/MySources/RP-Requirements-Web
   bash rp-workspace/deploy-on-vps/test-ssh-interactivo.sh
   ```

---

### Opción 2: Descargar Binario Precompilado

**Ventajas:**
- ✅ Funciona directamente en Git Bash
- ✅ No requiere WSL

**Pasos:**

1. **Descargar sshpass para Windows**:
   - Ve a: https://github.com/keimpx/sshpass-windows/releases
   - Descarga la última versión (archivo `.exe`)

2. **Colocar en el PATH de Git Bash**:
   ```bash
   # Opción A: En el directorio de Git Bash
   cp sshpass.exe "C:\Program Files\Git\usr\bin\sshpass.exe"
   
   # Opción B: En cualquier directorio y agregarlo al PATH
   # Edita ~/.bashrc y agrega:
   # export PATH="$PATH:/ruta/a/directorio/con/sshpass"
   ```

3. **Verificar instalación**:
   ```bash
   sshpass -V
   ```

4. **Ejecutar el script**:
   ```bash
   bash rp-workspace/deploy-on-vps/test-ssh-interactivo.sh
   ```

---

### Opción 3: Usar Chocolatey

**Ventajas:**
- ✅ Gestión de paquetes fácil
- ✅ Actualizaciones automáticas

**Pasos:**

1. **Instalar Chocolatey** (si no lo tienes):
   - Abre PowerShell como Administrador
   - Ejecuta:
   ```powershell
   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
   ```

2. **Instalar sshpass**:
   ```powershell
   choco install sshpass -y
   ```

3. **Verificar instalación**:
   ```bash
   sshpass -V
   ```

4. **Ejecutar el script**:
   ```bash
   bash rp-workspace/deploy-on-vps/test-ssh-interactivo.sh
   ```

---

### Opción 4: Usar expect (Alternativa)

Si no puedes instalar `sshpass`, puedes usar `expect` como alternativa:

**Instalar expect en Windows:**

1. **Usar Chocolatey**:
   ```powershell
   choco install expect -y
   ```

2. **O descargar desde**:
   - http://expect.sourceforge.net/
   - O usar el paquete de ActiveState

**Nota:** Requiere modificar los scripts para usar `expect` en lugar de `sshpass`.

---

## ✅ Verificar Instalación

Después de instalar `sshpass`, verifica que funciona:

```bash
sshpass -V
```

Deberías ver algo como:
```
sshpass 1.09
```

---

## 🚀 Después de Instalar

Una vez que `sshpass` esté instalado, puedes ejecutar:

```bash
# Script interactivo (recomendado)
bash rp-workspace/deploy-on-vps/test-ssh-interactivo.sh

# O script con variable de entorno
export VPS_SSH_PASSWORD='tu_contraseña'
bash rp-workspace/deploy-on-vps/test-ssh-ejecutar.sh
```

---

## 🔍 Troubleshooting

### Error: "sshpass: command not found"

1. Verifica que `sshpass` esté en tu PATH:
   ```bash
   which sshpass
   ```

2. Si no está, agrégalo al PATH o colócalo en un directorio que esté en el PATH.

3. Reinicia tu terminal después de instalar.

### Error: "Permission denied"

Si `sshpass` está instalado pero aún obtienes "Permission denied":
1. Verifica que la contraseña sea correcta
2. Prueba manualmente: `ssh root@72.60.63.240`
3. Verifica que el usuario sea correcto (`root`)

---

## 📝 Notas

- **WSL es la opción más recomendada** porque funciona igual que en Linux
- **Git Bash** puede funcionar con el binario precompilado
- **Chocolatey** es útil si ya lo usas para gestionar paquetes
- Los scripts de GitHub Actions **no requieren** que instales `sshpass` localmente (se instala automáticamente en los runners)

---

## 🔗 Enlaces Útiles

- [WSL Installation Guide](https://learn.microsoft.com/en-us/windows/wsl/install)
- [sshpass-windows Releases](https://github.com/keimpx/sshpass-windows/releases)
- [Chocolatey Package: sshpass](https://community.chocolatey.org/packages/sshpass)
- [expect for Windows](http://expect.sourceforge.net/)

