---
layout: post
title: "A rundown of Android Intent Selectors - You're building intents wrong!"
subtitle: "I was thrown for a loop writing this feature to open the user's browser ― Republished from the ASOS Tech Blog"
image: /images/intent-selector/hero.webp
---

> This post was originally published [here](https://medium.com/asos-techblog/a-rundown-of-android-intent-selectors-youre-building-intents-wrong-fdb8d3e58ce2) on the [ASOS Tech Blog](https://medium.com/asos-techblog).

**Does your app make this common Android faux-pas? This post explores a recent learning about Android Intents, and a common ‘gotcha’ that you might not even know you’re making.**

![](/images/intent-selector/hero.webp)

How do you open a link in the user's browser? You know, Chrome, Firefox, Samsung Internet. Well, you use an intent of course! 

Intents are how we communicate between processes on Android: activities, services, whatever. You would probably create an intent with the right action, add extra data (like the destination URL), then start it with startActivity(). 

You've almost certainly seen this before:

```kotlin
val url = Uri.parse("https://www.asos.com/")
val browserIntent = Intent(Intent.ACTION_VIEW, url))
startActivity(browserIntent)
```

While this method works, it's not really the correct approach. The problem is, it isn't obvious why this is wrong. It's a very simple intent, after all, and opening a link is a pretty elementary task. And if you run that code, it works. Some digging is clearly required.

Let's look at some documentation and see if we can spot the issue. The most interesting bit is probably Intent.ACTION_VIEW, so lets start there:

```kotlin
/**
 * Intent.ACTION_VIEW
 * Activity Action: Display the data to the user. This is the most common
 * action performed on data - it is the generic action you can use on
 * a piece of data to get the most reasonable thing to occur.
 */
```

"Display the data to the user" sounds like exactly what we want, so what's the catch? Here's the first clue: `ACTION_VIEW` is a very generic and wide-reaching intent, and not usually the most specific tool for the task. 

`ACTION_VIEW` essentially takes a URI and finds any suitable app to open it. It doesn't open a webpage, and it doesn't open a browser. It just does something 'reasonable' with our input.

The rest of the `ACTION_VIEW` docstring gives some clarity on that:

```kotlin
/**
 * For example, when used on a contacts entry it will view the entry; when used 
 * on a mailto: URI it will bring up a compose window filled with the information
 * supplied by the URI; when used with a tel: URI it will invoke the dialer.
 */
```

The most reasonable thing to do with a URL is to open it in the browser, right? Well, most of the time, yes—but what if the system could do something  more reasonable than opening in the browser? A better question might be, 'What is more reasonable than opening our link in the browser?'

### URLs, URIs, Web Links and Android App Links

This issue reared its head whilst implementing some code for gracefully handling users with outdated, unsupported Android versions. While they can't use the app on their ancient Android 5 phone anymore, they can still use our mobile site. After displaying a helpful message, I wanted to give the user a button to open our site, https://www.asos.com/, in their preferred browser.

But when I tapped my shiny new continue button, something strange happened:

![](/images/intent-selector/issue.gif)

The strange behaviour that sent me down this rabbit hole, from two different devices. If you're lucky, you'll see the app picker. If you're unlucky, you'll be stuck in an endless loop! That doesn't look right! This is the crux of the problem: Our `ACTION_VIEW` intent is merely looking for apps that can open the [https://www.asos.com/](https://www.asos.com/) link, and the ASOS app is one of those! This happens because the link is defined as a [_Web link_](https://developer.android.com/training/app-links/) in the ASOS app manifest, a type of deeplinking that uses the HTTP and HTTPS schemes.

These _Web links_ are registered and processed in-app similarly to custom scheme links (e.g. `asos://`). It means that if you share a product link with your bestie, they can open it straight in the app, without opening their browser first. This neat user experience shortcut has become commonplace, yet its broader implications are often overlooked. 

In our case, this isn't the behaviour we're aiming for. Yes, we want to open the URI, but really we should be more specific and say that we only want external browsers.

### Seeing Double: Intent Selectors

Here's the proper way to achieve this 'always open in an external browser' behaviour:

```kotlin
val url = Uri.parse("https://www.asos.com/")

val browserSelectorIntent = Intent()
  .setAction(Intent.ACTION_VIEW)
  .addCategory(Intent.CATEGORY_BROWSABLE)
  .setData(Uri.parse("http:"))

val targetIntent = Intent()
  .setAction(Intent.ACTION_VIEW)
  .addCategory(Intent.CATEGORY_BROWSABLE)
  .setData(url)

targetIntent.selector = browserSelectorIntent

startActivity(targetIntent)
```

Inspired by this discussion on the Android Issue TrackerYour eyes do not deceive you, we do really have two intents here. That seems bizarre at first glance, so let's look at what each part does, then the magic that brings it together.

First, we create an empty browser intent. This uses `ACTION_VIEW` like before for handling a URI, but also includes `CATEGORY_BROWSABLE`, which is used to narrow down our targets to activities that are specifically capable of being invoked from a link in a web page. In short, it ensures our links will be opened somewhere that can open and display it properly.

Then, we set the Intent URI to a blank HTTP-scheme (just the string `http:`). This gives us all the apps that can open these HTTP-scheme URIs. This will only include proper web browsers, as they're typically the only ones capable of opening such a URI. Remember, the ASOS app only accepts asos.com links, so it won't be included in this intent. Theoretically, you could put any HTTP/S scheme link in there, as long as it's not registered to any apps installed on your user's device.

The second intent is a bit more familiar. It includes both the `ACTION_VIEW` and the newly-added `CATEGORY_BROWSABLE` we discussed before, and our desired destination URL, too.

At this point, we have two intents—one that targets the apps we want, and one that targets the link we want. Now for the magic:

```kotlin
targetIntent.selector = emptyBrowserIntent
```

The selector property allows us to use the targeted apps from the first intent to open the second. Huzzah!

![](/images/intent-selector/result.gif)

Now we can use ASOS on mobile web, no problem!It really is as simple as that! Instead of relying on the URI to determine how our app should be opened, we can more accurately specify our requirements with a second intent. You can even add a second category to narrow the selection of apps even more; activities must satisfy all the categories you specify to be included as a target for your intent.

---

Android makes it so easy for apps to talk to each other, with convenient methods like `ACTION_VIEW`, it's easy to overlook the details. It's not just the browser this applies to—think tel: URIs in VOIP and phone dialer apps, or sharing your content to only certain types of app. Because we specify the target separately, we can choose apps any which way we want!

There you have it, a rundown of intent selectors in Android. If you ever run into intent irregularities in your implementation, an intent selector could just be the simplest solution to your struggles!