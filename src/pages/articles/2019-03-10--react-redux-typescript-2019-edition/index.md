---

title: Setting Up React + Redux + Typescript - 2019 Edition
date: '2019-03-10T10:00:00.000Z'
layout: post
draft: false
path: '/posts/setup-react-redux-typescript-2019-edition'
category: 'React'
tags:
- 'React'
- 'Redux'
- 'Typescript'
- 'Web Development'

description: "A summary of how I setup a React/Redux project with Typescript for a recent project. Also, some bonus CI setup as well."

---
# React + Redux App Setup: 2019 Edition
I've been getting comfortable with Angular at work for the past year, but was recently asked to spin up a new React app for an upcoming project. Apparently, a year is long enough to be left out of the loop. It took quite a bit of tweaking to get it up and running, but I finally feel comfortable with my 2019 React setup.

Here's a quick shopping list of the stuff included:
- React 16.8
- Redux 4.0.1
- connected-react-router (react-router-redux deprcated)
- SCSS
- Typescript
- Docker
- Pre-commit hooks
- yarn
- Jest & Enzyme

Check out the full project [Github Project](https://github.com/Lumlicious/react-redux-typescript-2019-edition)

**Note:  This is my personal setup method and preferences for projects and is in no way the "correct" way to do things. It works great for me though.

## Creating the app with "Create React App"
After a year+ of being spoiled with the Angular CLI I was very excited to see that React had implemented something similar: [Create React App](https://github.com/facebook/create-react-app). Here is a list of some of the cool stuff included:

```
-   React, JSX, ES6, TypeScript and Flow syntax support.
-   Language extras beyond ES6 like the object spread operator.
-   Autoprefixed CSS, so you don’t need  `-webkit-`  or other prefixes.
-   A fast interactive unit test runner with built-in support for coverage reporting.
-   A live development server that warns about common mistakes.
-   A build script to bundle JS, CSS, and images for production, with hashes and sourcemaps.
-   An offline-first service worke and a web app manifest, meeting all the  Progressive Web App criteria.
-   Hassle-free updates for the above tools with a single dependency.
```
This **really** speeds up the setup process.

To setup use: `yarn create react-app my-app`

or for pre-installed typescript: `yarn create react-app my-app --typescript`

### "EJECT!"
One caveat is that the app is setup in a very specific way and really isn't intended to be messed with (I believe older versions had problems using SASS, but it's been fixed in the latest). The project has a command `yarn eject` which moves all the "hidden" configuration into your project folder. 
 
**HUGE Warning: This process is irreversible!**

You need to be absolutely sure that there is no way to continue your work before you even consider this option. I personally didn't come across any reason to eject my project.

### *Decision to use Yarn
I've never really used yarn before and tried to use it exclusively to install dependencies. I like it, but really didn't see a huge performance increase.

## App Folder Structure
I needed an app structure that was scalable and modular enough for an Enterprise application, but still easy to understand. With the extra `types.tsx` file needed for Typescript I chose to create a store folder to hold the reducers, actions, and types for each data domain (or feature). The components are broken into modular folders, each with their own SCSS and tests.
```
├── src
│   ├── store
│   │   ├── App 
|   |   |   ├── reducers.tsx
|   |   |   ├── actions.tsx
|   |   |   └── types.tsx
|   |   └── index.tsx
│   ├── assets
│   ├── styles
│   |   ├── util
│   |   ├── base
│   |   └── style.scss
|   ├── components
|   |   ├── App
|   |   |   ├── App.scss
|   |   |   ├── App.test.tsx
|   |   |   └── App.tsx
|   ├── routes
|   |   └── index.tsx
|   index.scss
|   index.tsx
```
This structure is probably overkill for smaller projects but works well for what I need.

## SASS
The official [create-react-app documentation](https://facebook.github.io/create-react-app/docs/adding-a-sass-stylesheet) states that the CSS doesn't need preprocessors since components wont be sharing functionality. Personally, I think it's really useful tool to have. Mixins, functions, loops, and nested structure are tremendously helpful for tedious tasks. For this project in particular, I wanted to define the fonts, colors, headings, etc. that were defined in the design documents at a global level. All components could then share the variable definitions.

To add SASS, use:
`yarn add node-sass`

In the `src` directory I added a `styles` directory and inside of that, created `base` and `util` folders, as seen in the directory structure map above. The `util` folder will hold the colors, fonts, and variable definitions. The `base` folder is used for storing global component styles such as the grid system, buttons, typography, and any normalizing library ([normalize.css](https://necolas.github.io/normalize.css/)). Each component is individually styled but can access these global definitions to maintain consistency.

### BEM
On a quick side note, I'd highly recommend using the [BEM](http://getbem.com/) naming convention for CSS classes. It helps flatten out your CSS classes for readability and prevents crazy class nesting. It also works really well with SASS.

For instance when defining the block, element and modifier:
```scss
.block {
	&__element {
		&--modifier {
		}
	}
}
```
produces
```css
.block {}
.block__element {}
.block__elemnet--modifier{}
```
It's a really intuitive way to understand your class hierarchies.

** Note: I see this all the time with beginners -- only go one-level deep with naming. 
Ex: Don't use `.block__second-block__element`. Try to break up the component or a different one-level name.

## Typescript
I've come to respect the power of Typescript while working with Angular for the past year. Strict typing of data helped prevent/solve so many problems in dealing with complicated data-structures in my past projects.

If Typescript wasn't installed during the setup, use: 
`yarn add typescript @types/node @types/react @types/react-dom`

** note: The @types is a repo for Typescript Type definitions that make non-typescript libraries work with Typescript linting. For more info, check out the repo: [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) when the running the `create` command

## Redux Setup
Redux is a must have, but in order to work with typescript (or appease the almighty linter) the type definitions will also need to be imported.
```
yarn add react-redux @types/react @types/react-dom @types/react-redux
```
 
 ## Router
 Just a quick note about using the `react-router-redux` package, which synchronizes the routes with the store, is now deprecated, be sure to use [connected-react-router](https://github.com/supasate/connected-react-router) instead, or follow [this](https://reacttraining.com/react-router/web/guides/redux-integration) guide to work around.

## Getting Ready For CI/CD Pipeline
I'm not going to go into details about the pipeline, I just wanted to share an easy way to Docker-ize your application so it can easily be deployed by DevOps.
 
### Docker Setup
Create a file in the root directory called `Dockerfile`, then add the following lines of code to it:
```
FROM nginx:1.15.2-alpine
COPY ./build /var/www
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
ENTRYPOINT ["nginx","-g","daemon off;"]
```
This file basically a set of commands that assembles a Docker image of our application. It copies our build directory into the `var/www` directory of an[nginx](https://www.nginx.com/) server and spins the server up. 

Which brings me to the next script that needs to be added, the nginx configuration (from step 3 in Dockerfile). Create an `nginx.conf` file in the root directory then use [this code](https://github.com/Lumlicious/react-redux-typescript-2019-edition/blob/master/nginx.conf).

Full disclosure, I didn't write this code, but it gets the job done. This is just an example and is in no way what you have to use.

After you've finished setting everything up, you can test out the Docker image locally. Be sure you have [Docker](https://www.docker.com/) installed and have run `npm run build` to generate the `build` directory. Next, run the following commands in the command line:

```
// Creates the docker image
docker build --rm -f Dockerfile -t test-project
```
If this succeeds, then run the following command to mount the Docker image and run it:
```
docker run --rm -d -p 80:80 test-project:latest
```
The site should now be available on `http://localhost:80`. It's a great way to simulate how your app will run when deployed.

### Linter & Prettify Hooks With Husky
Keeping code syntax and format consistent between multiple developers is something that my projects have always struggled with. Everyone has their own way of doing things. [Husky](https://github.com/typicode/husky#readme) allows you to tie into git hooks and perform functionality before or after the hooks are executed.

 A very handy use for Husky is to enforce proper linting and formatting before anything can be pushed into the repository. For this project I attached onto the `commit` git hook and run the` linter` and `prettier` libraries before the code is committed. For now I have the code automatically updated, but it's probably better if you just throw up errors and and have the users fix it themselves.

```
yarn add lint-staged husky prettier --dev
```

Then add this as a parameter to the `package.json` file:
```json
"lint-staged": {
	"src/**/*.{js,jsx,ts,tsx,json,css,scss,md}": [
		"prettier --single-quote --write",
		"git add"
	]
},
"husky": {
	"hooks": {
		"pre-commit": "lint-staged"
	}
}
```
## Testing
[Jest](https://jestjs.io/) is pretty fantastic. It runs way faster than Jasmine and has much more verbose error logging. In fact, when working with Angular, I made a point to bring it in as the primary testing framework. Luckily it comes pre-installed with React.

### Jest & Enzyme
To help test React components, I like to bring in AirBnb's [Enzyme](https://airbnb.io/enzyme/) library. Enzyme helps tremendously with any type of DOM traversal required in tests. The most helpful function is [shallow rendering](https://airbnb.io/enzyme/docs/api/shallow.html), which makes it easier to truly test on a component level and not have to worry about mocking dependencies.

To install:
```
yarn add enzyme enzyme-adapter-react-16 react-test-renderer
```
Then create: `src/setupTests.js` and add:
```
import { configure } from  'enzyme'; import Adapter from  'enzyme-adapter-react-16'; 
configure({ adapter: new Adapter() });

// Typescript fix
export default undefined
```

## Closing Thoughts
Re-learning React after being away for a year was easier than expected and I've greatly enjoyed using it. Here are some observations I've had while setting everything up:

**Pros**

 - Husky hooks are awesome!
 - Enzyme makes testing much, much easier.
 - Create-react-app takes away all the tedious setup so you can get started quicker than ever.
 - Yarn is nice, but I haven't really seen a ton of benefits from NPM. I'll have to dig into it deeper.
 - It's nice to be back in React world.

**Cons:**
- To be honest, I think adding typescript added quite a bit of complication to the project. I was used to types, coming from Angular, but other React devs on the project had some epic battles with the Linter.
- Connected-react-router seems a bit overkill for my needs and added more complexity to the app.

Be sure to check out my [Github Repo](https://github.com/Lumlicious/react-redux-typescript-2019-edition) with an example version of the setup!

Thanks for reading!
-CL

