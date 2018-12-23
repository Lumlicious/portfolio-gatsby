---

title: Unity 2018 - Using SerialilzeField to expose private variables
date: '2018-12-20T10:00:00.000Z'
layout: post
draft: false
path: '/posts/using-serializefield-to-expose-private-variables'
category: 'Unity'
tags:
- 'Unity 2018'
- 'Tutorial'
- 'C#'
- 'Game Development'

description: "Most tutorials expose variables in the inspector by making them public even if they need to be private. After some research, I've found the safest/Best Practice approach to exposing private variables is by using [SerializeField]."

---

The most common approach to exposing variables in the editor is to make them publicly available. This approach is great for values that need to be tweaked without digging through the code, but can cause problems when referencing variables that need to remain private. A common use is using the Unity pattern of assigning prefab references by dragging them from the editor to the exposed variable slot on a script. This makes assigning references easy, but by making this variable public, the values can be changed/accessed programmatically from other scripts. This is fine for updating simple strings and integers, but can cause some undesirable effects when a prefab reference is changed. For example:

```csharp

using UnityEngine;
using System.Collections;

public class PlayerClass : MonoBehavior {

	public int playerHealth = 0; // <---- Fine to change in editor
	public GameObject player; // <---- Can be changed by code

	void Update() {
		Player.doSomething(); // <---- This can break if Player prefab is swapped for another
		...
	}
	
}
```

As shown above, if the Player prefab is accidentally swapped out with another, the methods on Player may not exist on the new prefab, which will break the code. This is just one basic side effect, lots of other crazy stuff could occur.

The "best practice approach" would be to to use `[SerializeField]` to expose a private variable to the editor.

```csharp

using UnityEngine;
using  System.Collections;

public class PlayerClass : MonoBehavior {

	public int playerHealth = 0;

	// public GameObject Player;
	[SerializeField] private  GameObject  playerPrefab;
	private  GameObject _player

	void Update() {
		_player = Instantiate(playerPrefab) as  GameObject;
		...
	}
}

```

In this example the `playerPrefab` reference variable is exposed to the editor, but remains private. As an added level of protection, the prefab reference is being stored in it's own variable and the instance of the prefab is being stored in another. This is a great pattern for instantiating a `GameObject`.

For more information on `[SerializeField]` check out the [Unity Reference](https://docs.unity3d.com/ScriptReference/SerializeField.html)

Thanks for reading!
-CL