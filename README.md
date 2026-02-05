# Project POS [![Build CI](https://github.com/mrepol742/project-pos/actions/workflows/build.yml/badge.svg)](https://github.com/mrepol742/project-pos/actions/workflows/build.yml)
A lightweight, web-based and offline-capable POS system built for flawless performance, supporting multi-department roles and full functionality.

## Pre-requisites

- PostgreSQL
- Node.js
- PHP
- Composer

## Setting up

- install dependecies

  ```sh
  composer install && npm install
  ```

- create environment

  ```sh
  cp .env.example .env
  ```

- generate app key

  ```sh
  php artisan key:generate
  ```
- database migration

  ```sh
  php artisan migrate --seed
  ```

## Start application

```sh
  npm run dev
```

## Refresh migration

```sh
  php artisan migrate:refresh
  php artisan db:seed
```

## Refresh cache

```sh
  php artisan config:cache
```

## License

This project is licensed under the [Polyform Noncommercial License 1.0.0](LICENSE).

&copy; 2026 Melvin Jones Repol.
