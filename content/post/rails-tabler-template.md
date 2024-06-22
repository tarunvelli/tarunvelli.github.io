---
title: "Rails tabler template"
summary: "Free and open source starter kit designed to streamline the development of web applications using the Ruby on Rails framework"
repo: "https://github.com/tarunvelli/rails-tabler-starter"
tags: [
    "rails",
    "template",
    "starter kit"
]
date: "2022-10-26"
---

<center>Rails starter boilerplate that you can clone and build on top of</center>

![rails-tabler](/assets/rails-tabler.gif)

<center>
    <a href="https://rails-tabler.fly.dev" target="_blank" rel="noopener noreferrer">Demo</a> |
    <a href="https://github.com/tarunvelli/rails-tabler-starter" target="_blank" rel="noopener noreferrer">Github</a>
</center>

## Goals

Users familiar with rails should be able to build with this boilerplate without requiring extensive introduction.

* No DSL
* Avoid complex frontend functionality
* Simplicity over efficiency

## Overview

### Baked in foundational models

When developing a robust web application, it's crucial to have a well-structured data model. This template includes multiple pre-built models that you can leverage to accelerate your project. Here are some of the key models you'll find:

* Users

    Your application's user base is at its core. With the User model, you can efficiently manage user registration, profiles, and authentication.

* Roles

    Roles play a pivotal role in defining user permissions and responsibilities within your application. Whether you have admins, moderators, or regular users, role management simplifies access control.

* Plans

    If your application offers various subscription plans with differing features and pricing, the Plans model is your go-to. It can store plan details and help users choose the subscription that suits them best.

* Subscriptions

    To handle user subscriptions, the Subscriptions model tracks subscription deatils, plan information, and renewal dates, making subscription management a breeze.

### User authentication & authorization

* Authentication through [Devise](https://github.com/heartcombo/devise)

    Devise, a widely-used authentication gem for Rails, offers ready-made components for user registration, login, and password recovery, ensuring a secure user experience.

* [OmniAuth](https://github.com/heartcombo/devise/wiki/OmniAuth%3A-Overview) for Third-Party Authentication

    Take your authentication capabilities to the next level by integrating OmniAuth. This allows users to log in using their social media or other online accounts, enhancing user convenience.

* Authorization with [Pundit](https://github.com/varvet/pundit)

    Pundit simplifies role-based authorization in Rails. Define policies to control access to specific resources or actions based on user roles, strengthening your application's security.

### Background worker & scheduler

Efficiently handle background tasks and job scheduling with the built-in support for Sidekiq and Sidekiq Scheduler. These tools ensure that resource-intensive tasks don't hinder your application's performance, enhancing overall user experience.

* [sidekiq](https://github.com/mperham/sidekiq/)
* [sidekiq-scheduler](https://github.com/sidekiq-scheduler/sidekiq-scheduler)

### Role management

Effective role management is critical for applications with diverse user privileges. Supports standard roles available across spaces while also allowing you to create custom roles specific to each space. Fine-grained permissions per role ensure precise control over user access.

### Multiple user groups support

Introduces the concept of a "Space" model to represent user groups, which can be teams, organizations, or any other namespace. You have the flexibility to enable or disable multi-space mode, making it suitable for various use cases:

* Example use case for turning on multi-space mode: Saas applications where multiple groups require separate spaces.
* Example use case for turning off multi-space mode: Internal organizational tools where only admins can invite users and create spaces.

### Pre built UI layouts

A well-designed user interface is key to providing an excellent user experience. The Starter Kit integrates high-quality UI elements and layouts from [Tabler](https://tabler.io/), allowing you to create a professional and polished appearance with ease.

### Development focussed

* [Annotate](https://github.com/ctran/annotate_models) - Annotate Rails classes with schema and routes information for improved code documentation.
* [Brakeman](https://github.com/presidentbeef/brakeman) - Static analysis security vulnerability scanner to identify potential security risks in your code.
* [Byebug](https://github.com/deivid-rodriguez/byebug) - Straightforward debugger for troubleshooting issues during development
* [Dotenv](https://github.com/bkeepers/dotenv) - Simplify environment variable management by loading them from a .env file.

## Setup

requires postgres and redis to run on local

```
brew install postgresql@12 redis
```

clone the repo

```
git clone https://github.com/tarunvelli/rails-tabler-starter.git
```

use asdf to install required dependencies, or setup the dependencies `.tool-versions` in another way
```
asdf install
```

setup and run dev server
```
bin/setup
bin/dev
```

Mark a user as admin from console to view admin features in the user dropdown
```
bundle exec rails c
> User.first.update(admin: true)
```

## AppSettings

Toggle app settigns at `/setup/edit`

* `AppSettings.interface_layout`
    * Layout of app
    * values ["VERTICAL", "HORIZONTAL", "OVERLAP", "CONDENSED"]

* `AppSettings.interface_mode`
    * Light/Dark mode of app
    * "SYSTEM" picks the mode from system preferences
    * Values ["LIGHT", "DARK", "SYSTEM"]

* `AppSettings.interface_theme`
    * Color theme of app
    * Values ["DEFAULT", "COOL"]

* `AppSettings.login_layout` one of
    * Layout of login screens
    * Values ["DEFAULT", "ILLUSTRATION", "COVER"]

* `AppSettings.multi_space_mode`
    * When true allows users to sign up and create spaces
    * When false allows only admin to invite users and create spaces
    * Values [true, false]

* `AppSettings.show_landing_page`
    * When true root path renders landing page
    * When false root path redirects to sign in page
    * Values [true, false]

### Sample settings for different use cases

Here are sample configurations for two different application types:

* Saas App

```
AppSettings.interface_layout = 'HORIZONTAL'
AppSettings.interface_mode = 'LIGHT'
AppSettings.interface_theme = 'DEFAULT'
AppSettings.login_layout = 'ILLUSTRATION'
AppSettings.multi_space_mode = true
AppSettings.show_landing_page = true
```

* Internal App

```
AppSettings.interface_layout = 'CONDENSED'
AppSettings.interface_mode = 'LIGHT'
AppSettings.interface_theme = 'DEFAULT'
AppSettings.login_layout = 'DEFAULT'
AppSettings.multi_space_mode = false
AppSettings.show_landing_page = false
```

## Deployment

* Deploy on [Fly.io](https://fly.io/docs/rails/getting-started/)
* Deploy on [Heroku](https://devcenter.heroku.com/articles/getting-started-with-rails7)

Happy coding!
