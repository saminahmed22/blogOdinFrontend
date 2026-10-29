# QuoteFork

A simple blogging site, part of the NodeJS course of The Odin Project's curriculum.

It contains features such as:

- Creating, drafting, editing, and deleting posts
- Creating, editing, and deleting comments
- Searching posts by title, description, or author name
- Infinite scrolling
- Bookmarking
- Voting system on posts
- A rich text editor integration(QuillJS)

Couple of options in the sidebar is filler options, hinted by the "Filler option" texts right above them.
To access most of the features above, you'll need to login/register. If you're feeling lazy about it, just use one of the dummy accounts there,
the username is always the first name in lower case, and the password is "Hello" for every account.

The repo contains a .vscode config for automatically launching the terminal and run build scrips. But to use it you'll need the extension called "Terminal Keeper" by Nguyen Ngoc Long. Alternatively you can simply run,

```
npm run build && npm run dev
```

Checkout package.json for other commands.
