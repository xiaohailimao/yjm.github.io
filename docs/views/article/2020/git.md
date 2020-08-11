---
title: Git 提交规范
date: 2020-03-29
tags:
  - Git
categories:
  - 文章
---

## commit message 提交步骤

- 选择提交类型

```sh
? Select the type of change that you're committing: (Use arrow keys)
> feat:     A new feature
  fix:      A bug fix
  docs:     Documentation only changes
  style:    Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
  refactor: A code change that neither fixes a bug nor adds a feature
  perf:     A code change that improves performance
  test:     Adding missing tests or correcting existing tests
  build:    Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
  ci:       Changes to our CI configuration files and scripts (example scopes:  Travis, Circle, BrowserStack, SauceLabs)
  chore:    Other changes that don't modify src or test files
  revert:   Reverts a previous commit
(Move up and down to reveal more choices)
```

- 填写影响范围

```sh
What is the scope of this change (e.g. component or file name): (press enter to skip)
```

- 填写简短描述

```sh
Write a short, imperative tense description of the change (max 95 chars):
```

- 填写详细描述

```sh
Provide a longer description of the change: (press enter to skip)
```

- 判定是否有冲突 ，有则填写冲突内容

```sh
Are there any breaking changes? (y/N)
# y
? Are there any breaking changes? Yes
? Describe the breaking changes:
```

- 判定是否修复未更改的 issues 问题，有则添加问题参考 ID

```sh
Does this change affect any open issues? (y/N)
# y
? Does this change affect any open issues? Yes
? Add issue references (e.g. "fix #123", "re #123".):
```

## script

提交 message

```sh
npm run commit
```

生成 CHANGELOG

```sh
npm run changelog
```

## package

```json
{
  "scripts": {
    "commit": "git-cz",
    "precommit": "lint-staged",
    "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s -w -r 0"
  },
  "lint-staged": {
    "{src,package}/**/*": [
      "prettier --write",
      "eslint --fix",
      "git add"
    ]
  },
  "config": {
    "commitizen": {
      "path": "./node_modules/cz-conventional-changelog"
    }
  },
  "husky": {
    "hooks": {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
      "pre-commit": "lint-staged"
    }
  },
  "commitlint": {
    "extends": [
      "@commitlint/config-conventional"
    ]
  },
  "prettier": {
    "semi": false,
    "singleQuote": false
  },
  "devDependencies": {
    "@commitlint/cli": "^9.1.1",
    "@commitlint/config-conventional": "^9.1.1",
    "conventional-changelog-cli": "^2.0.23",
    "cz-conventional-changelog": "3.0.2",
    "lint-staged": "^9.2.5",
    "commitizen": "^4.0.3",
    "husky": "^4.2.5",
    "eslint": "^6.7.2",
    "prettier": "^1.19.1",
  }
}
```
