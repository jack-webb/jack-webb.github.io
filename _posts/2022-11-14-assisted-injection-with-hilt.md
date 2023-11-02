---
layout: post
title: "Assisted Injection with Dagger and Hilt: A Double-Edged Sword"
subtitle: "Whether you're migrating to Hilt or want to specify your dependencies at runtime, find out how with this explainer, and red flags to look out for"
---

![](/images/assisted-inject/android.jpg)


Love it or loathe it, dependency injection is a cornerstone of modern Android architecture. You're likely most familiar with it from using Dagger or Hilt in your projects. By applying inversion of control to our code, we can make almost any class available anywhere in our app, without having to decide what dependencies to pass into its constructor. We don't have to think about initialising it; just ask, and it's there. Brilliant! 

Better still, the more recently revamped take on Dagger, Hilt, goes one step further, integrating into the Android SDK, thus simplifying traditional pain points like component scoping. You don't need to specify if your object should live as long as the app, or just the fragment. The framework does it for you. That sounds fantastic, where do I sign up?!

## A Quick Fix - The Factory Pattern

Okay, so you're integrating Dagger and Hilt into your app, and you have some classes to migrate. Resolving most dependencies is simple enough: You check what dependencies they each need, and find a way to inject them, be it annotating the constructor with `@Inject` (another Hilt shortcut), or using a Dagger-provided `@Provides` annotation on a provider method. But as you're working through your app, you find a constructor argument you can't quite remove. Perhaps it's necessary for building the initial state of your class or something. Either way, there's no clear fix and you're stuck. 

With some luck, the solution might be straightforward. We know we can provide a dependency with a provider method, so one option is to tell Dagger how to build the dependency, including that necessary uninjectable parameter, in our dependency injection module. Add some @Qualifier annotations and we can inject the right class for the job, easy peasy. 

It's a decent workaround, but not great; we still need to know the value when we're creating the module. That's fine if you only have a few values (e.g. an enum), but what if you need to initialise your class with a more complex state or some dynamic object? The question is, how can we take advantage of the benefits of dependency injection, but still provide our own parameter to the class?


### The Sword Factory

The proper solution to this is a Factory. This well-established design pattern allows us to encapsulate the object creation process, and thus control which dependencies are required up front, and which are provided behind-the-scenes. 

In this example, creating the `Sword` class requires a name (the dynamic value that we want to provide) and a `Blacksmith` (some other dependency). We want to initialise our classes with that dynamic name value, but without specifying the other dependency (or dependencies) every time.

The `SwordFactory` class encapsulates the process of creating a `Sword`. It takes our desired `Blacksmith` in the constructor, and provides a `createSword` method that uses this Blacksmith instance along with a dynamically provided name to create a `Sword`. 

```kotlin
class Blacksmith @Inject constructor() {
    fun forge() { println("Forging the sword...") }
}

class Sword(val name: String, val blacksmith: Blacksmith) 

class SwordFactory(private val blacksmith: Blacksmith) { 
    fun createSword(name: String) = Sword(name, blacksmith)
}

// Assume the Blacksmith is already made injectable with
// our existing DI setup, maybe even with Dagger already
@Inject
lateinit var blacksmith: Blacksmith

// Create the factory wherever we need the sword
// eg. Viewmodel, repository, sword shop, etc.
val swordFactory = SwordFactory(blacksmith)

// Then use the factory to create a sword
val excalibur = swordFactory.create("Excalibur")

// The result...
excalibur.blacksmith.forge() // Forging the sword...
excalibur.name == "Excalibur"
```

###### Okay, the Lady of the Lake isn't really a blacksmith, but she makes a  fine sword!

Notice that we have to specify the dependency when we create the factory? This is fine, but imagine maintaining that in a production app, with five or ten dependencies. Then, scale that across your whole app - that's a lot of extra code to type and grok. With Kotlin and (most) Modern Android Development, we've come to love reduced boilerplate and complexity. Why can't our dependency injection feel the same?

##### Life is good, but it can be better.

![Pedro Pascal extols the virtues of using Dagger's AssistedInject in Wonder Woman 1984, showing us the more concise code achieved using Assisted Injection](/images/assisted-inject/pedro.png)
###### Pedro knows what's up with @AssistedInject!

## A Quicker Fix - Dagger Assisted Injection

Assisted Injection is Dagger's streamlining of this pattern. Instead of specifying our dependencies in the Factory, Dagger does the heavy lifting and automatically populates what it can, and lets us mark the stuff that needs providing. Let's look at our example, but using Assisted Injection.

```kotlin
class Blacksmith @Inject constructor() {
    fun forge() { println("Forging the sword...") }
}

class Sword @AssistedInject constructor(
    @Assisted val name: String,
    val blacksmith: Blacksmith
)

@AssistedFactory
interface SwordFactory {
    fun create(name: String): Sword
}

// Notice we don't have to specify the Blacksmith,
// because Dagger already knows about it
@Inject 
lateinit var swordFactory: SwordFactory

// Create our sword just like before
val excalibur = swordFactory.create("Excalibur")

// The result...
excalibur.blacksmith.forge() // Forging the sword...
excalibur.name == "Excalibur"
```

This short example doesn't look like it's saved much code (in fact, our snippet is longer!), but now that we don't have to manually provide all the dependencies in our Factory, we can scale much more easily. Adding a new dependency is just a matter of injecting it where it's required - we no longer have to go and update all of our Factories in the process. Easy peasy! Let's break it down to see where the magic happens:

#### @AssistedInject

Where you might ordinarily use @Inject on your classes' constructor, @AssistedInject lets us mark the class as not having all of its dependencies injectable.

#### @Assisted

Annotate your to-be-provided dependencies, so Dagger recognises they're not to be injected.

#### @AssistedFactory

Acts just like our regular Factory, but is created by Dagger at compile time to include the dependencies for us!

## The Catch - 

If you've made it to here and thought "that's fantastic, that solves my problem perfectly!", you're in the same spot as me. I learned about this when migrating some particularly old and tricky Presenter classes. I added `@AssistedInject`, and just like that, these tricky classes were made easily injectable. However, as I learned, there is a caveat you should be aware of. Less a caveat, more a 'missing the forest for the trees'. There are absolutely times when Assisted Injection is the best tool for the job, but look closely before you wield it. 

If you find yourself resorting to Assisted Injection frequently, especially in new code, consider whether you're using it as a crutch to avoid addressing more fundamental issues in your application's architecture. Excessive use is a red flag that your application is not truly adhering to good software engineering principles, like Inversion of Control and Separation of Concerns. Those aren't the only two, but they are the _most common_ issues I've seen masked in the wild when employing Assisted Injection.

### Inversion of Control

I said at the beginning that we don't really have to think about initialization when using dependency injection, but that's not strictly true. What we're really doing is using DI to achieve Inversion of Control (IOC). IOC is a big deal because it brings so many benefits: Lower coupling of components, better testability, more flexible reusability, and ease-of-use, to name a few. 

This principle shifts the responsibility of dependency initialization onto the class itself, instead of the developer manually creating the requisite objects and instantiating the class they want to use. 

In an ideal world, your class already knows what dependencies it needs, and those classes already know what dependencies they need. The chain continues until you reach the bottom, where classes either don't have dependencies or constructor arguments, or those can be provided through other means (Network libraries like Retrofit and OkHttp are classic examples). When you start using Assisted Injection, you start creating these dependencies directly in code, breaking that nice chain of pre-defined dependencies in your dependency graph.

Make sure you're using Assisted Injection only in instances where you can't pre-define your dependencies. In good architecture, this will be in isolation, in a way that won't cascade to other classes in your codebase. If you're not careful, your code will end up tightly coupled to its dependencies, making it difficult to test and maintain.

### Separation of Concerns

Imagine we're creating a sword for our adventurer. Our code might look like this to start. Let's assume our blacksmith is already provided by Dagger, for the sake of brevity. 

```kotlin
class Sword @AssistedInject constructor(
    @Assisted val name: String,
    val blacksmith: Blacksmith
)

@AssistedFactory
interface SwordFactory {
    fun create(name: String): Sword
}

class Adventurer @Inject(
    @Inject private var swordFactory: SwordFactory
){
    private val sword
 
    init {
        sword = swordFactory.create("Excalibur") 
    }

    fun goOnAdventure() { ... }
}
```

However, a new requirement comes in. Our blacksmith isn't happy, because we've asked them to create a sword without providing any materials! We can't make our sword without materials, so we need to specify some as a dependency. If we use Assisted Injection to give our Sword Factory some material, it would look like this:

```kotlin
class Sword @AssistedInject constructor(
    @Assisted val name: String,
    @Assisted val metal: Metal,
    val blacksmith: Blacksmith
)

@AssistedFactory
interface SwordFactory {
    fun create(name: String, metal: Metal): Sword
}

class Adventurer @Inject(
    @Inject private val swordFactory: SwordFactory,
    @Inject private val metalStorage: MetalStorage
){
    private val sword
 
    init {
        val steelForMySword = metalStorage.getSteel()

        sword = swordFactory.create(
            "Excalibur",
            steelForMySword
        ) 
    }

    fun goOnAdventure() { ... }
}
```

Spot the problem? Our Adventurer is now responsible for getting the material for their sword. That's no good - they should be off slaying dragons and rescuing maidens!

This is a classic Separation of Concerns violation. The Adventurer shouldn't need to know about getting the steel, because that's not their job. Now they're doing two things, our code is more coupled and harder to test. What if our method of obtaining materials changes, or different adventurers want swords of different materials? We'd have to modify our Adventurer class, when it's not necessary.

When you use Assisted Injection, consider who is really responsible for providing these additional parameters? You could be bloating a class with responsibilities that lie outside its domain.

## A Happy Ever After