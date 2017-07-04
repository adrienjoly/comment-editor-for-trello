# Glitch <> GitHub Sync

Using [git hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) and [githubhook](https://github.com/nlf/node-github-hook).

- Set a secret string for `GITHUB_WEBHOOK_SECRET` in the `.env` file in your Glitch project. 

- Create a webhook on GitHub using the same secret string. From the repo on GitHub, go to `Settings > Webhooks > Add Webhook`.

- Get Glitch to remember your GitHub login details. Run:

```
git config credential.helper store
git push https://github.com/yourUsername/yourRepo.git master --force
```

Log in with your username and password, and it'll be remembered so you won't need to specify them again (if you use 2-Factor Auth, then you need to [generate a personal access token](https://github.com/settings/tokens) to use as your password)

Then create a git hook in .git/hooks called `post-commit`, with the following content:
```
#!/bin/sh
git pull https://github.com/yourUsername/yourRepo.git
```
