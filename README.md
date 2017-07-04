# Glitch <> GitHub Sync

Experimental two-way syncing between a Glitch project and a GitHub repo, using [git hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) and [githubhook](https://github.com/nlf/node-github-hook).

Glitch takes periodic snapshots of a project with git. When a new snapshot is taken, a git hook pushes the latest changes in the Glitch project to your GitHub repo. The Glitch project also looks out for Webhooks about changes to the GitHub repo, and runs a pull request to get the latest changes.

The result is syncing of changes when they're made on [Glitch](https://glitch.com/edit/#!/glitch-github-sync) or [GitHub](https://github.com/garethx/glitch-github-sync).

## Setup

- [Remix this Glitch project](https://glitch.com/edit/#!/remix/glitch-github-sync).

- Create a new repo on GitHub, initializing it with a readme. Then export your Glitch project to that repo.

- Set a secret string for `GITHUB_WEBHOOK_SECRET` in the `.env` file in your Glitch project. 

- Create a Webhook on GitHub using the same secret string. From the repo on GitHub, go to `Settings > Webhooks > Add Webhook` and use `https://yourproject.glitch.me/github/callback` as the callback URL. 

- Get Glitch to remember your GitHub login details (we've added `.git-credentials` to `.gitignore` so they don't get shared on GitHub). From the console in Glitch, run:

  ```
  git config credential.helper store
  git push https://github.com/yourUser/yourRepo.git master --force
  ```

  Log in with your username and password, and it'll be remembered so you won't need to specify them again (if you use 2-Factor Auth, then you need to     [generate a personal access token](https://github.com/settings/tokens) to use as your password).

- Then create a git hook in `.git/hooks` called `post-commit`, with the following content:
  ```
  #!/bin/sh
  git pull https://github.com/yourUser/yourRepo.git
  ```
  Make sure it's executable using `chmod +x post-commit`.

- Update the pull request URL in `git.sh` to pull from your own repo.
