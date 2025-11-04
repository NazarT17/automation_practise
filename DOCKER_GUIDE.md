# Docker Setup Guide

## Prerequisites

Install Docker Desktop from: https://www.docker.com/products/docker-desktop

## Usage

### 1. Build the Docker Image

```bash
npm run docker:build
```

This builds a Docker image with:

- Playwright v1.56.1 with all browsers pre-installed
- All project dependencies
- Your test code

### 2. Run Tests in Docker

```bash
npm run docker:test
```

This will:

- Start the container
- Run API tests (`npm run test:api`)
- Save results to mounted volumes (allure-results/, logs/, etc.)
- Stop the container automatically

### 3. Run Tests and Clean Up

```bash
npm run docker:test:clean
```

This removes any existing containers before running tests.

## What Gets Mounted?

The following directories are mounted from your host to the container:

- `./allure-results` - Allure test results
- `./allure-report` - Generated Allure reports
- `./playwright-report` - Playwright HTML reports
- `./test-results` - Test artifacts (traces, videos, screenshots)
- `./logs` - Winston logs

## After Running Tests in Docker

Generate and view Allure report:

```bash
npm run allure:generate
npm run allure:open
```

Or use the combined command:

```bash
npm run allure:serve
```

## Manual Docker Commands

Build image:

```bash
docker compose build
```

Run tests:

```bash
docker compose up
```

Run tests with cleanup:

```bash
docker compose down && docker compose up
```

Run specific npm script:

```bash
docker compose run playwright-tests npm run test:api
```

## Environment Variables

The container sets:

- `CI=true` - Enables CI mode (retries, parallel execution)
- `NODE_ENV=production` - Production environment

## Troubleshooting

### Issue: Container exits immediately

Check logs:

```bash
docker compose logs
```

### Issue: Permission errors on mounted volumes

On Linux, you may need to adjust permissions:

```bash
chmod -R 777 logs/ allure-results/ playwright-report/ test-results/
```

### Issue: Old test results

Clean up before running:

```bash
rm -rf allure-results/* logs/* test-results/*
npm run docker:test
```
