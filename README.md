# Dice Stats
A foundry vtt module to view dice stats (Number of each roll in a Chart! See Below)  
Currently stats are stored by parsing chat. If the user joins the game late after rolls were made  
they will only get data from that point on unless **Auto DB** Setting is enabled. Original Idea was from [Catan Online](https://colonist.io/)  
end-of-game dice stats screen and wanted something similar to let players look at during or the end of a session.   

Used Google Charts as a charting library. (MIT License)
Used [Roll Tracker Module](https://foundryvtt.com/packages/roll-tracker) as a starting point but (MIT License)  
Wanted the ability to track multiple dice types. This Basically lead to a full rewrite as I wanted a more OOP appreach for data storage.

## MISC Design Settings
- GM's Rolls for player will count as GM Rolls (Unless Midi Qol is active)
- Blind rolls get tracked but do not get added to results screen unless GM Presses "PUSH BLIND ROLLS" button on Global Stats Display
- GM Data Does not get added to global stats by default so Players cant use it to cheat and see any of the GM's rolls
- Database is not automatically used by default (auto DB adding and loading) as its unclear of the performance impact

## DESIGN PHILOSOPHY
The original design philosophy was a way to view SESSION stats. Rolls will always avg out over long periods of time so personaly I only wanted to look at per session data. Because of this the implementation resets stats when leaving in joining. There is now a DB setting if you would like stats to stay between sessions

## DEPENDENCIES
[socketlib](https://github.com/manuelVo/foundryvtt-socketlib) | 
[socketlib Foundry Page](https://foundryvtt.com/packages/socketlib)
Socketlib needs to be active allow GM to tell other users to push blind rolls.

## INCOMPATABILITIES (Add an Issue for any System Requests)
- Any system that doesnt print rolls to chat
- **Midi-Qol** if **Merge Rolls to 1 Card** is enabled but have a partial fix. 
    - Midi-qol.rollComplete hook Doesnt have a way to trace back to the Player that rolled. Only the actor
    - I Used actor.owner property to find out who to associate the roll with but that makes the following issues
        - If an actor has >1 owner it might not track the roll to the right player. 
        - If the GM rolls for a player is will count as the players roll Not the GM's where normally this isnt the case

# Features 

## Form Info and Features (Individual)  
- Checkboxes to limit which dice types are displayed 
- Refresh Button To update stats if a new roll is made while screen if open
- Number of each roll 
- Total Number of rolls
- Mean  
- Median (true-Middle for Odd or left-middle for Even number of rolls)
- Mode  
- Streaks (Incrementing die rolls in a row) 4,5,6,7 ect  
- Save and Clear Player Data to DB
  
## Form Info and Features (Global)
- Checkboxes to limit which dice types are displayed 
- Refresh Button To update stats if a new roll is made while screen if open 
- Total Number of each roll
- Globa Mean
- Global Median (true-Middle for Odd or left-middle for Even number of rolls)
- Global Mode
- Global Longest Streaks (Player Name and Streak Value)
- Most Min and Most Max values Rolled (Player Name and Number)
- Clear All Players Data (GM Only)

## Dice Types Supported  
Tracks multiple dice types. Currently supporting types are:  
- D2, D3, D4, D6, D8, D10, D12, D20, D100
  
## Module Settings (Not All are Implemented Yet)
[Def: XX] = Default value for setting  
(Global) & (Local) = setting scope  
Global Settings are restricted to GM only by default
- PLAYERS_SEE_SELF -------------- If players are allowed to view their stats -----------[Def: True]     (Global)
- PLAYERS_SEE_PLAYERS --------- If players cant see self they cant see others either -[Def: True]     (Global)
- PLAYERS_SEE_GM -------------- If Players can see GM dice roll stats ----------------[Def: False]    (Global)
- PLAYERS_SEE_GLOBAL --------  If Players Can  Global Dice Stats --------------------[Def: True]     (Global)
- PLAYERS_SEE_GM_IN_GLOBAL - If GM roll stats get added into global stats ---------[Def: False]    (Global)
- ENABLE_BLIND_STREAK_MSGS - Allow strk from a blind roll to be prnt to chat ------[Def: false]    (Global) 
- ENABLE_AUTO_DB - Save And Load Info From DB Automatically On Join and On roll respectively -[Def: true]   (Global)
- SHOW_BLIND_ROLLS_IMMEDIATE -- let Blind Rolls be added to player stats immediately ---[Def: false] (Global)
- ENABLE_CRIT_MSGS ------------  Choose what dice print crit msgs ---------------------[Def: d20]      (Local)
- TYPES_OF_CRIT_MSGS ---------- Choose Type of crits to print ------------------------[Def: Both]     (Local)
- ENABLE_STREAK_MSGS -------- Choose what dice to display streak msgs for ----------[Def: d20]     (Local)  
- ENABLE_OTHER_ACCESS_BUTTONS - Move buttons from Playerlist to scene controls ---[Def: true] (Local)
- OTHER_ACCESS_BUTTON_ICONS - Setting to add custom icons on Scene Controls buttons - [Def: false] (Local)

## Install  
If prerelease version is desired the user can add to module folder by hand by placing it in   
```bash
$/PATH_TO_FOUNDRY_DATA(Prolly AppData foulder on windows)/Sources/Modules
```  
## Usage  
- View Each Players info by selecting icon next to the player in the bottom left
  - Press D20 For Player Stats
  - Press Globe for Global Stats (Should only have 1 globe by clients username)  
![Player List Buttons](https://i.imgur.com/QhwLQOX.png)

- If **Use Other Access Buttons** is enabled the buttons are removed from the player list and are instead added to the SCENE Controls.
    - ![Icon Img](https://i.imgur.com/y0IwT0b.png) ![Icon Img 2](https://i.imgur.com/cXyQ1AV.png)
    - Icons for Global and Compare buttons are hard coded and cant be changed
    - The default value is the d20 icon but users can change the players Icons from the D-20 to anything on the font awesome icon website under the free section
    - [Where to find Icons](https://fontawesome.com/search?o=a&m=free)
    - Users can change the icons but updating the **Define Player Icons** field in the game settings
    - Update the field to a comma seperated list of the ion text from the font awesome website. The order of the text list corresponds to the order of players in the player list from top down. 
    - EX: Updating the field to `fa-solid fa-book-open-reader, fa-solid fa-dumbbell, fa-solid fa-explosion` as sceen in the following image changes the icons to what I have in my photos (Photo doesnt show full string of icons)
    - ![My Settings Values](https://i.imgur.com/CocZunr.png)

- Hideing GM Values from players so they cant cheat to see the GM rolls
- PLAYERS_SEE_GM = False  (Warning is displayed if trying to view GM values with setting sating you cant)
![PLAYERS_SEE_GM = False](https://i.imgur.com/sGELoCJ.png)  
  
- Database Interaction
    - **Automatically use DB** setting will allow users roll data save between session, load immediately on joining, autosave every roll but it could negatively impact performance
    - If **Automatically use DB** is **Disabled** players can still save and load the info between sessions but they need to do it manually and if they forget leaving and rejoining will clear their data
    - ![PLAYER DB](https://i.imgur.com/yrwyJJH.png)

## FORM PHOTOS
### Player D20  
![PL D20](https://i.imgur.com/Sszy3bk.png)   

### Player D20 BLIND
![PL D20 B](https://i.imgur.com/EOYY6y6.png) 

### GLOBAL D20 BLIND
![GLB D20 B](https://i.imgur.com/mLXWWjm.png) 

### CHECKBOXES
![CHK](https://i.imgur.com/pVFw0QE.png)

### Global Clear Local Data Button
![GLB CLR](https://i.imgur.com/GtGz0h4.png)
  
