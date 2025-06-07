---
layout: post
title: "Supercharge your (Android) terminal experience"
subtitle: "A tour of the command line tools I use every day as an Android Engineer ― Republished from the ASOS Tech Blog"
---

> This post was originally published [here](https://medium.com/asos-techblog/supercharge-your-android-terminal-experience-c71448bf40cc) on the [ASOS Tech Blog](https://medium.com/asos-techblog).

One of the earliest classes I took as a student was an “Introduction to Command Line” module. It covered navigating the filesystem, interacting with the machine, and simple things like that. The lecturer would rhapsodise about how much easier and faster it was. After a few classes, that began to resonate. And by the end, I was using the command line for everything I could.

Fast-forward to here and now, and things are a bit different. At ASOS, and in the industry at large, we’re always interacting with intricate tools and processes. There’s boundless context to remember, and copious parameters required by our tasks. Many of my colleagues, and I’m sure yours too, have eschewed the command line for reasons analogous. I get it. Why remember all the options and context to perform one of a litany of task-specific actions, when you can point and click there on the screen?

![My image, and this is its alt text](/images/supercharge/thinkpad.webp)

###### My beloved Thinkpad X220, where my command line journey began. Nowadays I use a Mac, but I still enjoy going back to my Ubuntu i3wm install every now and again.

We can do better than this. In the Android world, we replace most of this stuff with Android Studio. Aside from its great IDE features, it has the right defaults to make these peripheral tasks easier. The default terminal is not suited to our complicated, domain-specific tasks.

So let’s make it so: Adapt our environment to the task at hand, and learn some neat commands to streamline our process. Let’s supercharge our terminal!

> I wrote most of this post during Tech Develops at ASOS. It’s a day each month where ASOSers can investigate or build any tools that work for them. In previous iterations, we’ve used the time to supercharge some of our command line tools, employing the cool stuff below.

### Getting started with Oh My Zsh

First things first, we need a good shell. This is the basis of our setup — it’s where our commands are executed. There are lots of options, but one of the most popular and extensible is Zsh. On top of Zsh, we’ll use the equally popular Oh My Zsh framework. These two are actually in our team’s default recommended setup script at ASOS, and for good reason.

I’ll give instructions for MacOS here, and assume you already have Homebrew installed. I started with much of this on Ubuntu using i3wm, so this can all be ported to Linux systems easily.

Installing is easy; If you’re on MacOS, Zsh is the default shell, so you just need to add the framework. This command can install it to any Zsh shell.

<script src="https://gist.github.com/jack-webb/d0f6db8de58957a1910f965af3d80bb4.js"></script>

> A quick word of warning: Piping curl/wget directly into sh is not recommended. Always check what you’re downloading before executing!

One of Oh My Zsh’s greatest features is its plugin system. These are bundled scripts that add a catalogue of neat functionality. There are over 270 plugins, boosting the functionality of autocomplete, build tools, languages, services, and more. We’ll touch on a few of these Android-y ones later, but you should totally explore the [plugin listing](https://github.com/ohmyzsh/ohmyzsh/wiki/Plugins) once you’re set up.

Oh My Zsh also has built-in themes. Not just pretty colours, they allow you to add git status, return codes, and even environment details (e.g. Kotlin versions, pyenv, rbenv, node) with no extra configuration. There are [loads included](https://github.com/ohmyzsh/ohmyzsh/wiki/Themes), and [even more](https://github.com/ohmyzsh/ohmyzsh/wiki/External-themes) provided by the community.


A terminal window displaying three command line prompts. Each one is a different theme option available using Oh My ZSH.

![My image, and this is its alt text](/images/supercharge/themes.png)

###### The robbyrussell, headline and fino themes. These all show git status (staged/committed/untracked etc), and can even show environment information if it’s available.

Your configuration is handled by a .zshrc file, which is a general config for both Zsh and Oh My Zsh. It can be found in the home directory (cd ~). The dot at the start of the filename means it’s a hidden file, so you won’t see it by default in Finder or file explorer. Use ls -a to list it in the command line.

Most important for this article are the plugins and ZSH_THEME parts.

- You can choose your theme by adding a line like this to your config  
`ZSH_THEME=robbyrussell`
- You can add plugins with a line like this, space-separating your options  
`plugins=(git fzf adb another_cool_plugin)`

### The warm fuzzy feeling from warm fuzzy finding

Fuzzy finding means you don’t need to type every letter of what you’re searching for. If you have a long path, you just need a few characters. How about navigating those unwieldy package directories? It’s much the same as the familiar Search Everywhere in Android Studio/IntelliJ. Just hit a few characters in order, and you’re done.

FZF is probably the most popular tool for the job on the command line, and for good reason. At its core, it just provides fuzzy finding for some list of things, but it’s many integrations mean we can use it to find files or search our command history in a flash. All I need to do is type some bits of the path that I remember, in order, and FZF will do the rest.

Say I need to navigate to the PodcastHomeViewModel. I know it’s in the podcast.home package, so I know it will have ‘cast’ and ‘home’ in its path. I could type casthomeviewm, and it’d show in the results. Check out this example:


![Searching files and shell history with FZF. Notice the green bits? They show what your search term matches. File search examples from android/compose-samples.](/images/supercharge/fzf.gif)
###### Searching files and shell history with FZF. Notice the green bits? They show what your search term matches. File search examples from android/compose-samples.

In the ASOS app, it’s not unusual to see directories ten or twenty levels deep; Our modular app architecture makes for some long package names. Navigating these with the command line can be time-consuming. Luckily for us, FZF takes the sting out.

Installation on Mac can be done with Homebrew:

```
brew install fzf
```

Once installed, enable it by adding fzf to the plugins list of your OMZ config.

You can use Ctrl+R to search command history, and Ctrl+T to bring up the file search in-situ. Navigate results with the arrow keys, and hit Enter to select one. Much better!


### Don’t click for git!

Git commands can be unwieldy. And even when they’re not, you type the common ones that often, why not make them quicker? Oh My Zsh has a plugin for shortening them to just a few characters, usually based on the first letters of the command’s constituent arguments. I no longer have to strain typing out git push --force to revise my commits, a simple gpf will do.

```
ga — git add

gcam "Initial commit" — git commit --all --message “Initial commit”

gco develop — git checkout develop

gpsup — git push --set-upstream origin $(current_branch)

gst — git status

grename <old> <new> — Branch rename from <old> to <new>, incl. origin!
```

Enable the plugin by adding git to the plugins list of your OMZ config.

I use these every day, probably saving thousands of keystrokes in the process. For the times I do something more complicated, I can just fall back to regular git commands. And on the odd occasion I’m juggling branches like chainsaws, I can always switch to a GUI client.

Sometimes working with lots of collaborators on a big project, like the ASOS app, necessitates a GUI. Maybe to avoid blocking other pieces of work, maybe to structure dependency chains so everything falls into place nicely. I can use the GUI to remove some of the overhead in building a mental model of the branch structure.

But it’s still overkill for most tasks. Try the terminal, then try the OMZ git plugin. Not only will you git faster, but keeping a little bit more of git’s mental model in your head will make you the go-to-git-guru in your team. Jury’s still out on whether that’s a good thing.

## Android goodies
### Android Debug Bridge (adb)

The Android Debug Bridge is actually a command line program from the outset, but most of our interactions with it are through Android Studio, be it deploying apps or debugging them. It’s a real shame because most of this super powerful tool’s functionality is hidden away. You can control almost all aspects of your device with its seemingly endless commands. Let’s look at a few handy ones.

First, let’s add the adb plugin to our Zsh config. This gives us handy auto-completing. Similar to fzf above, just add it to the plugins list:

```
plugins=(... adb ...)
```

Almost every day I use the shell command for interacting directly with the phone. It’s like the Zsh shell we set up earlier, but right on the device. All the available commands can be found in the documentation, but the most useful ones are nicely organised at adbshell.com. Most often, I use it to change screen size and dimensions, so I can quickly see how a layout will look in different conditions and on various devices:
Handy commands for changing screen configuration

This is a life-saver for me when building UIs at ASOS. We already have a few alternative layouts and good tablet support, and with Google’s push for foldable’s and large-format displays, it’s only going get more useful. Gone are the days of pulling out myriad devices every time I iterate!

However, this is the command line after all, so the cool tricks don’t stop there. Pipes are used to pass the output of one command into another. This means we can create a little pipeline to apply an adb command to all our test devices. Here’s how I can install an app and configure permissions on a bunch of different devices simultaneously:
Interacting with multiple devices, with the power of xargs

Here, we get the connected devices with adb devices, use tail and cut to turn that readable output into a list of device identifiers, then xargs to run our command against a bunch of devices. Typically, command line programs “do one thing, and one thing well” (the Unix philosophy). This modular approach, means we can chain simple bits together to do really complex and sophisticated things.

### scrcpy

How do you record demos and clips on your test device? It probably has a recorder built in, but that means you need to transfer the clip over. Or maybe you record an emulator, but really you’d prefer to interact with your app by touch, just like your users do.

scrcpy is a command line tool that mirrors (and records) your device’s screen on your computer. Among its many other tricks, it makes recording interactive demos a breeze. You can even interact in the other direction, meaning clicks and swipes on your machine are sent to the connected device. Perhaps you really can’t be bothered to pick it up.

It’s got lots of other features too, like Clipboard and audio sharing, USB OTG, and even Device-as-a-webcam. To top it off, it’s super lightweight and performant, too. It’s a real Swiss army knife, that — even if you’re not sold on the terminal way of life — you should be using.

Setup is super simple. It uses adb under the hood, meaning you just need to connect your device in Android Studio, and scrcpy will take care of the rest.
Because scrcpy uses adb underneath, you can even connect it to an emulator. I’m sure there’s a good reason you’d want to do that. I can’t think of one. But it’s possible!

### easy-dumpsys

Ever struggle to find the Activity or Fragment for some screen in your app? Wouldn’t it be nice to see the class name of what’s on your screen right now? You could do this with adb, accessing the device shell and using the dumpsys command, but easy-dumpsys is a small utility that makes this process really easy. It even makes use of our new friend FZF.

Watch the following clip, where we can quickly see what Activity and Fragment is on-screen whilst navigating through KeepassDX.

![easy-dumpsys takes the similarly-named adb command, and provides a pretty, easy-to-read output.](/images/supercharge/easydumpsys.gif)
###### easy-dumpsys takes the similarly-named adb command, and provides a pretty, easy-to-read output.

Keeping with the easy theme, you can install it easy-peasy with Homebrew:
```
brew tap kardelio/easy-dumpsys
brew install easy-dumpsys
```

### Bonus: stop typing the ticket name!

As projects grow, so do the needs of those managing them. You’re probably familiar with Jira, or some other ticketing tool, where each piece of work has a ticket number assigned to it. It’s good practice to include these in your commit messages, so anyone looking through the code later can see exactly what, when and why things have changed.

But typing them out every time would be a headache. Thankfully, we can use git hooks to automatically add it to all our commit messages. That also includes ones from Android Studio, if it’s set to use your system’s git install.

In your repository, navigate to .git/hooks/, and create a file called prepare-commit-msg, with no file extension. I’d recommend using nano or vim. Then, paste this script in:

You can customise how the ticket number is displayed by editing the part in quotes on line 14. Don’t forget to escape any special characters. You can also change how and where it’s inserted on line 17, but you’ll need to learn a bit about the sed command first.

Once done, save your script,¹ and run chmod +x prepare-commit-msg to enable execution of the script.

That’s it! Our script will intercept any commit commands, get the current branch name, then use sed to manipulate it to the start of the commit message.

[1] Save your script with Ctrl+X, Y in nano, or :wq in vim

---

These are just some of the tricks and tools I’ve found over the years. You certainly don’t need all of them, but just building one or two into your workflow will yield gains in the stuff you do every day. As you go, you’ll find those tools that fit just right, like a glove. From there, it’s down the rabbit hole, and who knows where it might lead. One thing’s for certain: You’ll feel right at home on the command line, and better for it.