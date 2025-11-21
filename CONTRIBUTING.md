# Conventions

Read the conventions before contributing to the project.
Mind that different conventions apply to documentation and source code repository.

## Definitions

|Word|Definition|
|-|-|
|Type|The type is the category of an issue, pull request or commit.|
|Scope|The scope is the part of the project that is affected.|

If not otherwise defined, these definitions apply.

## Commit conventions

Commits start with a preamble, followed by a short description and an optional reference to an issue or similar.
The syntax of a commit has to match:

```
<type>(<scope>): <short summary>

<reference to issue or other>
```

Mind the blank line!
Use the same preamble for all commits on a branch.
The simple rule of thumb: if the preamble doesn’t match prior preambles, then it doesn’t belong to the branch.
Example of a correct commit history:

```txt
feat(frontend/menubar): add user icon
feat(frontend/menubar): make user icon resizable
feat(frontend/menubar): add user menu
feat(frontend/menubar): remove legacy implementation
```

### Types

|Type|Description|
|-|-|
|feat|new feature|
|refactor|code change that neither fixes a bug neither adds a feature|
|test|add or update test(s)|
|fix|a bug fix|
|docs|updating documentation|
|chore|build, config or dependency change|

### Scope

The scope is the affected part of the project by the change.
Subscopes are separated from parent scopes by using `/`.
Examples:

* `frontend/menubar`
* `database`
* `rest`

When updating the documentation, use the page you’re updating as scope, e.g.: `docs(team overview)`.

### Short summary

Use the summary field to provide a succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize the first letter
* no dot (.) at the end

## Issue conventions

Title of issue follows this syntax: `<type>(<scope>): short description`.

### Types

Must be one of the following:

|Type|Description|
|-|-|
|`bug`|Report a problem in the software|
|`feature`|Request a new feature|
|`rework`|Request code refactoring|
|`docs`|Code documentation related|

The idea behind these types is that commit types are "answers" to issue types:

* `bug` - `fix`
* `feature` - `feat`
* `rework` - `refactor`

### Scope

The scope is optional if the scope isn't clear.
See [convention definitions](#definitions) for more information about scopes.

### Level

Set the level of the issue importance by setting the level label in GitHub.
Three levels exist:

* **Level 1 "Crucial":** Fundamental implementation or dangerous bug
* **Level 2 "Major":** Mandatory feature or bug
* **Level 3 "Minor":** Nice to have

## Pull Requests

Title of pull request follows this syntax: `<type>(<scope>): short description`.

### Types

Must be one of the following:

|Type|Description|
|-|-|
|`feat`|new feature|
|`refactor`|code change that neither fixes a bug or adds a feature|
|`test`|add or update test(s)|
|`fix`|a bug fix|
|`docs`|updating documentation|
|`chore`|build, config or dependency change|

### Scope

See [convention definitions](#definitions) for more information about scopes.
Note that the scope is not optional.

### Body

The body of a pull request explains changes precisely. Give references if needed.

### Example

```
feat(frontend/menubar): rework menubar

change the menubar icon arrangement and add new settings-button.

fixes #1 and #2
```

### GitHub tags

Use GitHub tags when creating a new pull request.
Use the correct GitHub tag for your scope.
If a tag for your scope doesn’t exist, create a new tag.
