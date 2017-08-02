# ![](icon-32px.png) Trello Outliner

A Trello Power-Up that allows you to edit card comments using an Outliner.

![trello outliner teaser](https://github.com/adrienjoly/trello-outliner/raw/master/docs/markdown-editing.gif)

▶ More details: [Submission on Atlassian's Codegeist](https://devpost.com/software/trello-outliner-lpv3zt)

▶ Source code: [Glitch](https://glitch.com/edit/#!/trello-outliner-github) (*feel free to remix it!*)

### For whom was it designed for, and why?

Trello Outliner is made for people who leverage Markdown-formatted comments to take and edit structured notes.

It extends that experience with:

- a full-screen editor, for more focus / less distractions
- WYSIWYG Markdown editing
- outliner-like indentation of bullet points
- prevent you from accidentally aborting changes without saving

Still not getting it? 🤔 If you want to know more about my Trello-based productivity workflow, read "[Work on 12 projects without burning out 🔥 – Be Yourself](https://byrslf.co/work-on-12-projects-without-burning-out-f5bec50dafdb)".

### Development and production flow

Everytime a commit is pushed to the `master` branch, it's also pushed to the glitch server, thanks to [glitch-github-sync](https://glitch.com/edit/#!/glitch-github-sync). Check glitch's logs for status and errors.

### Installation

This Power-up is currently **under review** by Trello, but will hopefully be publicly available before September 2017. If you want to be notified when it's done, feel free to sign up [there](http://eepurl.com/cWtVi1).

In the mean time, you can **test it from a public sample board**, by following the instructions below.

### Want to test this Power-up?

I can definitely use your help to improve the quality of this power-up!

Just follow these instructions:

1. join the [test board](https://trello.com/invite/b/C1BeGLFW/755950e252ae81aeb6c899187fab1be2/trello-outliner-tests-latest)
2. open the "[test](https://trello.com/c/ERiqMB1L/1-test-card)" card and write a random comment
3. click the **outline a comment** button (on the right)
4. after authorising the power-up, select your comment from the list => a new tab will open
5. make some changes in your comment, then click on **save**
6. go back to the test card (initial tab) and make sure that your comment is up to date

**If it's not**, please go back to the tab that was opened at step 4, open your JavaScript console (press `cmd-alt-J`, `ctrl-shift-J`, or `F12`) then [send me a copy](https://github.com/adrienjoly/trello-outliner/issues/new) of the whole contents of the console, to help me understand what went wrong and fix it.

Thank you in advance for your help! 🙌 
