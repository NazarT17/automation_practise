# CI/CD Pipeline Guide

This project uses GitHub Actions for continuous integration and deployment.

## 🚀 Workflows

### 1. API Tests CI (`api-tests.yml`)

**Triggers:**

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`
- Manual trigger via GitHub UI
- Scheduled: Monday-Friday at 9 AM UTC

**What it does:**

- ✅ Installs dependencies
- ✅ Runs API tests with Playwright
- ✅ Generates Allure reports
- ✅ Uploads test artifacts (results, reports, logs)
- ✅ Comments on PRs with test results

**View results:**
Go to Actions tab → Select workflow run → Download artifacts

---

### 2. Docker Tests CI (`docker-tests.yml`)

**Triggers:**

- Push to `main` branch
- Pull requests to `main`
- Manual trigger

**What it does:**

- ✅ Builds Docker image
- ✅ Runs tests in isolated container
- ✅ Generates Allure reports
- ✅ Uploads artifacts
- ✅ Cleans up Docker resources

**Benefits:**

- Consistent environment across all runs
- No dependency on runner's system
- Perfect replica of production testing

---

### 3. Deploy Allure Report (`deploy-report.yml`)

**Triggers:**

- After successful API Tests CI run
- Manual trigger

**What it does:**

- ✅ Downloads latest Allure report
- ✅ Deploys to GitHub Pages
- ✅ Provides public URL for viewing reports

**Setup Required:**

1. Go to Settings → Pages
2. Source: GitHub Actions
3. Save

Your reports will be available at:
`https://<your-username>.github.io/<repo-name>/`

---

## 📊 Artifacts

Each workflow run creates artifacts that are stored for 30 days:

| Artifact            | Description                 | Size   |
| ------------------- | --------------------------- | ------ |
| `allure-results`    | Raw test execution data     | ~100KB |
| `allure-report`     | Generated HTML report       | ~2MB   |
| `playwright-report` | Playwright HTML report      | ~1MB   |
| `test-logs`         | Winston logs                | ~50KB  |
| `test-results`      | Traces, videos, screenshots | Varies |

---

## 🔧 Manual Triggers

All workflows support manual triggering:

1. Go to **Actions** tab
2. Select workflow (e.g., "API Tests CI")
3. Click **Run workflow**
4. Select branch
5. Click **Run workflow** button

---

## 📈 Viewing Reports

### Option 1: Download Artifacts

1. Go to Actions → Select workflow run
2. Scroll to **Artifacts** section
3. Download `allure-report.zip`
4. Extract and open `index.html`

### Option 2: GitHub Pages (if configured)

Visit: `https://<your-username>.github.io/<repo-name>/`

### Option 3: Local Generation

```bash
# After downloading allure-results
npx allure serve allure-results
```

---

## 🔐 Secrets & Environment Variables

Currently no secrets are required. If you add authenticated APIs:

1. Go to Settings → Secrets and variables → Actions
2. Click **New repository secret**
3. Add:
   - `API_KEY`: Your API key
   - `API_URL`: API base URL (if different)

Then update workflows:

```yaml
env:
  API_KEY: ${{ secrets.API_KEY }}
```

---

## 🎯 Best Practices

### For Contributors

- ✅ Run tests locally before pushing: `npm run test:api`
- ✅ Check CI status before merging PRs
- ✅ Review Allure reports for failures
- ✅ Keep test execution under 5 minutes

### For Maintainers

- ✅ Monitor scheduled test runs
- ✅ Review artifact storage (30-day retention)
- ✅ Update dependencies regularly
- ✅ Keep workflows lightweight

---

## 🐛 Troubleshooting

### Tests fail in CI but pass locally

**Solution:**

```bash
# Run in CI mode locally
CI=true npm run test:api

# Or use Docker (exact CI environment)
npm run docker:test
```

### Artifacts too large

**Solution:**

- Reduce video quality in `playwright.config.ts`
- Only capture on failure: `video: "retain-on-failure"`
- Reduce retention days in workflows

### Scheduled tests not running

**Possible causes:**

- Workflow file not on default branch
- Repository is inactive (GitHub disables after 60 days)
- Syntax error in cron expression

**Solution:**

- Push a commit to trigger workflow
- Check Actions tab for errors

---

## 📝 Workflow Syntax

### Cron Schedule Examples

```yaml
- cron: "0 9 * * 1-5" # 9 AM UTC, Monday-Friday
- cron: "0 */6 * * *" # Every 6 hours
- cron: "0 0 * * *" # Daily at midnight
- cron: "0 0 * * 0" # Weekly on Sunday
```

### Branch Filters

```yaml
on:
  push:
    branches: [main, develop, "feature/**"]
  pull_request:
    branches: [main]
```

---

## 🚀 Future Enhancements

Potential additions:

- [ ] Slack/Email notifications on failures
- [ ] Performance testing metrics
- [ ] Parallel test execution across multiple runners
- [ ] Integration with test management tools
- [ ] Automatic PR reviews based on test coverage
- [ ] Deployment to staging/production environments

---

## 📚 Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Playwright CI Guide](https://playwright.dev/docs/ci)
- [Allure Report](https://docs.qameta.io/allure/)
- [Docker Documentation](https://docs.docker.com/)
