# trishul-app-template

This repository is a Cookiecutter template for creating new Trishul applications. It is managed with Cruft so template updates can be tracked and synced into generated projects.

## Why Cookiecutter + Cruft

- Cookiecutter provides an easy way to generate a new project from this template.
- Cruft wraps Cookiecutter templates and lets you keep generated projects in sync with template changes (via `cruft update`).

We recommend using Cruft so changes to the template can be pulled into existing projects later.

## Repository URL

Template repository:

[trishul-app-template repository](https://github.com/trishulio/trishul-app-template.git)

## Prerequisites

Install Cookiecutter and Cruft. On macOS the easiest way is Homebrew; on other platforms use pip.

macOS (Homebrew):

```zsh
brew install cruft
brew install cookiecutter
```

Cross-platform (pip):

```zsh
python -m pip install --user cruft cookiecutter
```

If you install with pip, make sure your PATH includes the user base scripts directory (usually `~/.local/bin` on Linux). Use a virtual environment if preferred.

## Create a new project from the template

Use `cruft create` and point it at this repository. This will run Cookiecutter and prompt for template variables.

Basic interactive create (choose a target directory when prompted):

```zsh
cruft create https://github.com/trishulio/trishul-app-template.git
```

Create into a named directory (non-interactive prompt flow):

```zsh
cruft create https://github.com/trishulio/trishul-app-template.git my-new-app
```

If you want to automate input, you can pass a cookiecutter context file or use the `--no-input` flag (be careful: this skips prompts).

## Syncing template updates

When the template changes and you want to apply updates to a project generated from this template, run:

```zsh
cd my-new-app
cruft update
```

This will show you the available updates and let you apply them interactively. That is why we use Cruft — it makes it possible to keep projects aligned with template improvements.

## Notes

- Cruft stores metadata in your generated project (a `.cruft.json` file) so it knows which template and revision the project came from.
- Read the Cruft docs for advanced usage: [Cruft documentation](https://cruft.readthedocs.io/)

---

Additional template usage notes may live in the `{{cookiecutter.project_slug}}/README.md` files generated per project.
