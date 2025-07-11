# Printer Server

## Pre-requisites
- Php v8.2^
- Composer

---

### **1. Setup and Initialization**

- **Install Dependencies**  

  ```sh
  composer install
  ```

- **Configure Environment Variables**

  - **On Linux/macOS:**

    ```sh
    cp .env.example .env
    ```

  - **On Windows (Command Prompt):**

    ```cmd
    copy .env.example .env
    ```

  - **On Windows (PowerShell):**

    ```powershell
    Copy-Item .env.example .env
    ```

  Update the following variables in your `.env` file:

  - **`STORE_NAME`**: The name of your store.
  - **`PRINTER_NAME`**: The exact name of the printer to use.

  > **Note:**  
  > Ensure printer sharing is enabled for the selected printer so the application can access it.

---

### **2. Deployment**

- **Start Application**  

  ```sh
  composer run start
  ```

- **Test Print**  

  ```sh
  composer run test
  ```

---