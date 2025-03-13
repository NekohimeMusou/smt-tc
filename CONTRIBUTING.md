<!-- omit in toc -->
# Contributing to SMT: Tokyo Conception for FVTT (Unofficial)

First off, thanks for taking the time to contribute! 💖

All types of contributions are encouraged and valued. See the [Table of Contents](#table-of-contents) for different ways to help and details about how this project handles them. Please make sure to read the relevant section before making your contribution. It will make it a lot easier for us maintainers and smooth out the experience for all involved. The community looks forward to your contributions. ✨

> And if you like the project, but just don't have time to contribute, that's fine. There are other easy ways to support the project and show your appreciation, which we would also be very happy about:
>
> - Star the project
> - Tweet about it
> - Refer this project in your project's readme
> - Mention the project at local meetups and tell your friends/colleagues

As always, **this project is not affiliated with, or endorsed by, LionWing Publishing or ATLUS. Please don't contact their representatives for support. Please don't report bugs on their Discord server or whatever; open an [Issue](https://github.com/NekohimeMusou/smt-tc/issues/new) on GitHub.** It ensures the relevant information is in one place where ~~I won't forget it exists and~~ all contributors can see it.

<!-- omit in toc -->
## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [I Want To Contribute](#i-want-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Your First Code Contribution](#your-first-code-contribution)

## Code of Conduct

This project and everyone participating in it is governed by the
[SMT: Tokyo Conception for FVTT (Unofficial) Code of Conduct](https://github.com/NekohimeMusou/smt-tc/blob/main/CODE_OF_CONDUCT.md).
By participating, you are expected to uphold this code. Please report unacceptable behavior
to <nekohime.musou@gmail.com>.

## I Want To Contribute

> ### Legal Notice <!-- omit in toc -->
>
> When contributing to this project, you must agree that you have authored 100% of the content, that you have the necessary rights to the content and that the content you contribute may be provided under the project license.

### Reporting Bugs

<!-- omit in toc -->
#### Before Submitting a Bug Report

A good bug report shouldn't leave others needing to chase you up for more information. Therefore, we ask you to investigate carefully, collect information and describe the issue in detail in your report. Please complete the following steps in advance to help us fix any potential bug as fast as possible.

- Make sure that you are using the latest version.
- Read the [system documentation](https://github.com/NekohimeMusou/smt-tc/wiki).
- Try to reproduce the problem in a fresh world with no modules enabled. If you can't, try using [Find the Culprit](https://foundryvtt.com/packages/find-the-culprit) to narrow down the module(s) involved. [Koboldworks - Data Inspector](https://foundryvtt.com/packages/data-inspector) might help you.
  - If a module is involved, check its issue tracker and see if it's a known problem with the module.
- To see if other users have experienced (and potentially already solved) the same issue you are having, check if there is not already a bug report existing for your bug or error in the [bug tracker](https://github.com/NekohimeMusou/smt-tc/issues?q=label%3Abug).
  - You can also hop onto the [LionWing Publishing Discord server](https://discord.gg/nYV38qukAE) and look in the dedicated thread in the **#smt-trpg-homebrew** channel.
  - **The Discord thread is a community space, not an official support channel. It is not the place to file bug reports. This project is not affiliated with LionWing. Please do not ask their representatives for support.**
- Collect information about the bug:
  - Associated Javascript console errors (press F12 in your browser to see the console)
  - OS, Platform and Version (Windows, Linux, macOS, x86, ARM)
  - Your Foundry server version *and build.* Please don't just say "version 12", say "version 12, build 331"
  - Any Foundry modules involved and their versions
  - Can you reliably reproduce the issue?

<!-- omit in toc -->
#### How Do I Submit a Good Bug Report?

> You must never report security related issues, vulnerabilities or bugs including sensitive information to the issue tracker, or elsewhere in public. Instead sensitive bugs must be sent by email to <nekohime.musou@gmail.com>.
<!-- You may add a PGP key to allow the messages to be sent encrypted as well. -->

We use GitHub issues to track bugs and errors. If you run into an issue with the project:

- Open an [Issue](https://github.com/NekohimeMusou/smt-tc/issues/new). (Since we can't be sure at this point whether it is a bug or not, we ask you not to talk about a bug yet and not to label the issue.)
- Explain the behavior you would expect and the actual behavior.
- Please provide as much context as possible and describe the *reproduction steps* that someone else can follow to recreate the issue on their own.
  - Ideally, use a fresh world with no modules enabled.
  - If the issue involves a module, use only the module(s) necessary to reproduce it.
- Provide the information you collected in the previous section.

Once it's filed:

- The project team will label the issue accordingly.
- A team member will try to reproduce the issue with your provided steps. If there are no reproduction steps or no obvious way to reproduce the issue, the team will ask you for those steps and mark the issue as `needs-repro`. Bugs with the `needs-repro` tag will not be addressed until they are reproduced.
- If the team is able to reproduce the issue, it will be marked `needs-fix`, as well as possibly other tags (such as `critical`), and the issue will be left to be [implemented by someone](#your-first-code-contribution).

<!-- You might want to create an issue template for bugs and errors that can be used as a guide and that defines the structure of the information to be included. If you do so, reference it here in the description. -->

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for SMT: Tokyo Conception for FVTT (Unofficial), **including completely new features and minor improvements to existing functionality**. Following these guidelines will help maintainers and the community to understand your suggestion and find related suggestions.

<!-- omit in toc -->
#### Before Submitting an Enhancement

- Make sure that you are using the latest version.
- Read the [documentation](https://github.com/NekohimeMusou/smt-tc/wiki) carefully and find out if the functionality is already covered, maybe by an individual configuration.
- Perform a [search](https://github.com/NekohimeMusou/smt-tc/issues) to see if the enhancement has already been suggested. If it has, add a comment to the existing issue instead of opening a new one.
- Find out whether your idea fits with the scope and aims of the project. It's up to you to make a strong case to convince the project's developers of the merits of this feature.

<!-- omit in toc -->
#### How Do I Submit a Good Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues](https://github.com/NekohimeMusou/smt-tc/issues).

- Use a **clear and descriptive title** for the issue to identify the suggestion.
- Provide a **step-by-step description of the suggested enhancement** in as many details as possible.
- **Describe the current behavior** and **explain which behavior you expected to see instead** and why. At this point you can also tell which alternatives do not work for you.
- You may want to **include screenshots or screen recordings** which help you demonstrate the steps or point out the part which the suggestion is related to. You can use [LICEcap](https://www.cockos.com/licecap/) to record GIFs on macOS and Windows, and the built-in [screen recorder in GNOME](https://help.gnome.org/users/gnome-help/stable/screen-shot-record.html.en) or [SimpleScreenRecorder](https://github.com/MaartenBaert/ssr) on Linux.
- **Explain why this enhancement would be useful** to most users. I endeavor to support house rules and the like, but some things have a better reward-to-effort ratio than others. You may also want to point out other projects that solved it better and which could serve as inspiration.

<!-- You might want to create an issue template for enhancement suggestions that can be used as a guide and that defines the structure of the information to be included. If you do so, reference it here in the description. -->

### Your First Code Contribution

> This process is finicky and has too many manual steps, I want to fix it eventually

This project is written in Typescript, so if you've cloned the repository, an additional compilation step is required for it to work in Foundry.

<!-- omit in toc -->
#### Prerequisites

You'll need to have [node.js](https://nodejs.org/en) installed. Depending on your platform, you can get the installer from their website or use your OS's package manager. If you're going to build the compendium pack(s), you'll also want a locally-installed copy of the Foundry server.

<!-- omit in toc -->
#### Compiling the System

Change to the project root and install the development dependencies:

    > npm i

The build script is suboptimal at the moment, so unless you *need* the macro compendium, I suggest deleting the "packs" object from system.json before doing this. That way, you can rebuild the system while it's running in Foundry and F5 it to see the changes.

Run the build script. If it's your first time compiling the system on your machine; if you're building the system compendium; or if you've made any other changes to system.json, **shut down your Foundry server before doing this.**

    > npm run build

Symlink the `dist` folder it generates into your Foundry systems directory, rename the link to `smt-tc`, and you're good to go. If you built it without the system compendium, you're done; you can load up Foundry and create a world.

<!-- omit in toc -->
#### Compiling the System Compendium

The *first* time you do this, you'll need to configure fvtt-cli first:

    > npx fvtt configure

As of now, the build script copies the source json for the compendium into the `dist` folder, so all you should have to do is ensure that fvtt-cli is looking in the right place, then compile the database.

    > npx fvtt package workon smt-tc
    > npx fvtt package pack macros

As of writing there's only one compendium pack with five or so macros in it, and it's unlikely to change much, so until the build script improves I recommend building it with the compendium once, copying the macros into your world, and then shutting down your server and rebuilding it without the compendium. You can put them in a world compendium and use [Mana's Compendium Importer](https://foundryvtt.com/packages/mkah-compendium-importer) to move them between worlds without having to do this again.

<!-- ### Improving The Documentation -->
<!-- TODO
Updating, improving and correcting the documentation

-->

<!-- ## Style Guides -->

<!-- ### Commit Messages -->
<!-- TODO

-->

<!-- ## Join The Project Team -->
<!-- TODO -->

<!-- omit in toc -->
## Attribution

This guide is based on the [contributing.md](https://contributing.md/generator) generator!
