# Project Name Template

This theme is built on Shopify Online Store 2.0 and Shopify CLI 3.63.0

## Before You Start

- [Intro to Online Store 2.0](https://www.shopify.com/partners/blog/shopify-online-store)
- [Install Shopify CLI](https://shopify.dev/docs/api/shopify-cli)
- [Customize a Theme](https://shopify.dev/docs/storefronts/themes/getting-started/customize)
- [Shopify CLI Theme commands](https://shopify.dev/docs/api/shopify-cli/theme)

## Development
> Note: Please read through the links above before getting started.

### I. Project Setup

** This build requires a GSAP Premimum License with a `.npmrc` file. Otherwise, remove and adjust dependencies and components as needed.

- Download and rename the _template-shopify folder
- In **package.json**, edit any instance of `project-name`
- In **gruntfile.js**, edit the `theme` variable
- In **project-name-theme/README.md**, rename **Project Name** Theme
- In **project-name-theme/config/settings_schema.json**, rename **Project Name** Theme
- Run `npm install`

> Note: All `npm` and `grunt` tasks must be in root folder

Once the project is set up and you're ready to start development use the following command to watch files:

```
grunt dev
```

### II. Shopify Setup

In a seperate project terminal navigate to the shopify theme.

```
cd project-name-theme
```

Make sure you're logged in to the store you're trying to edit by running the `--store` flag at the end of your first command.

```
--store project-name.myshopify.com
```

Or type the following to find out which store you're currently logged into and it will promp you to login.

```
shopify theme info
```

If you're working from a theme that already exists make sure you're pulling any data that was added on the live site without deleting or overriding any files. The `-n` or `--nodelete` runs the pull command without deleting local files.

```
shopify theme pull -n 
```

Once you're in your Shopify theme run the following to open your local environment:

```
shopify theme dev
```

## Production
> Note: Make sure to backup all files before pushing live.

### I. Project Setup
Run the `min` task to to minify files, compress all images, and purge any unused CSS.

```
grunt min
```

If you don't want to compress images or purge CSS, but still want to minify files you can run the the `prod` task.

```
grunt prod
```

### II. Shopify Setup
If it's your first time setting up the theme make sure to upload the theme to the store.

```
shopify theme push --unpublished
```

Otherwise, make sure you're pulling any data that was added on the live site without deleting any new files.
```
shopify theme pull -n 
```

Once this is completed, publish theme to live site.
```
shopify theme push -p
```