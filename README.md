# Glitch <> GitHub Sync

Using [git hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) and [githubhook](https://github.com/nlf/node-github-hook).

`git config credential.helper store`
`git push https://github.com/garethx/standing-hoe.git master --force`

Log in with your username and password, and it'll be remembered so you won't need to specify them again (if you use 2-Factor Auth, then you need to [generate a personal access token](https://github.com/settings/tokens) to use as your password instead.)

Then create a git hook in .git/hooks called `post-commit`, with the following content:


