mesh-2.0
========

Implements a mesh-like system for Scratch 2.0, using Scratch 2.0's extension feature and a node.js server.

Match-making
========

Currently, once you connect to a mesh server using the connect block, your project is in a restricted state, where you can not properly use mesh. To get to a state where the broadcast and variable features are active, you must have a partner with whom you will play/use the project in question with. There are two mechanisms of doing this:

A) Named groups. One player will create a group with their name (typically their username), and the other player will use the join group block using the name the other player used to find and join the group. This allows two friends to play together, but requires that they communicated about playing through some other medium (such as comments on their Scratch profiles or Skype messages).

or B) "Any" groups. Using the "join any group" block, the server will match the player with the next available player who also uses the "join any group". Perfect if you just would like to play the game, and do not care who you will play the game with.

Once a second player is found, the "when group full" hat block will activate.

