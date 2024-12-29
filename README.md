
# Ignite CLI  

Ignite CLI is a powerful tool designed to bootstrap entities for projects built using the [Susanoo Express Framework](https://github.com/moayyadfaris/susanoo). It provides an intuitive way to generate scaffolds for models, DAOs, handlers, controllers, and migrations, helping you kickstart your development process with ease and consistency.  

## Features  
- Generate scaffolds for various entities like models, DAOs, handlers, controllers, and migrations.  
- Supports creating scaffolds for all or specific entities at once.  
- Allows customization through a templates folder.  
- Includes trace and logging capabilities for debugging and clarity.  

---

## Installation  

```bash  
npm install ignite-cli --save-dev  
```  

---

## Usage  

The Ignite CLI command is `ignite`. Below are the available commands and their usage:  

### General Syntax  

```bash  
ignite [options] <command>  
```  

### Options  

- `-t, --trace`  
  Display trace statements for commands. Useful for debugging.  

---

### Commands  

#### Generate Scaffolds  

```bash  
ignite g [type] -n <name> [options]  
```  

- **Description**:  
  Generate scaffolds for models, DAOs, handlers, controllers, migrations, or all of them.  

- **Arguments**:  
  - `type`: The type of scaffold to generate. Possible values:  
    - `model`: Generate a model scaffold.  
    - `dao`: Generate a DAO scaffold.  
    - `handler`: Generate a handler scaffold.  
    - `controller`: Generate a controller scaffold.  
    - `migration`: Generate a migration scaffold.  
    - `all OR LEAVE IT EMPTY`: Generate all scaffolds.  

- **Options**:  
  - `-n, --name <name>` (required): Name of the entity (e.g., `AdvertisingNetwork`).  
  - `-v, --version <version>`: API version (default: `v1`).  
  - `-e, --entity <entity>`: Entity folder (default: `app`).  

- **Example Commands**:  
  Generate all scaffolds for an entity:  
  ```bash  
  ignite g all -n AdvertisingNetwork  
  ```  

  Generate a specific scaffold (e.g., model):  
  ```bash  
  ignite g model -n AdvertisingNetwork  
  ```  

  Generate multiple scaffolds (e.g., model and handler):  
  ```bash  
  ignite g model,handler -n AdvertisingNetwork  
  ```  

---

## Custom Templates  

Ignite CLI creates a `templates` folder inside an `ignite` directory in your project. This allows you to customize the default templates for generated scaffolds.  

### How to Use Custom Templates  

1. **Locate the templates folder**:  
   After running the CLI for the first time, you will find a folder structure like this in your project:  
   ```
   ignite/
     templates/
       model/
       dao/
       handler/
       controller/
       migration/
   ```  

2. **Edit Templates**:  
   - Modify the files within each folder to match your project's coding style or specific requirements.  
   - Future scaffolds will use these customized templates.  

3. **Restore Defaults**:  
   - If you need to restore the default templates, simply delete the customized files. The CLI will regenerate them the next time you run a command.  

---

## Debugging and Logs  

- Use the `--trace` option to enable detailed logs for commands:  
  ```bash  
  ignite g all -n AdvertisingNetwork --trace  
  ```  

- Logs include:  
  - Command execution details.  
  - Arguments and options passed.  
  - Success or error messages for each scaffold.  

---

## Contributing  

Feel free to contribute to the project by submitting issues or pull requests to the [GitHub repository](https://github.com/moayyadfaris/susanoo).  

---

## License  

This project is licensed under the MIT License.  
