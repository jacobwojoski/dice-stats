# Roll Tracker
A module to view dice stats of every player including the gm.

Stats Tracked (Each Player)
    Number of each roll (Plans to make roll data as a bar chart)
    Mean
    Median
    Mode 
    Streaks (Incrementing die rolls in a row) 4,5,6,7 ect

Tracks multiple dice types. Currently supporting
D2, D3, D4, D6, D8, D10, D12, D20, D100

Module also allows to view dice stats of the full game (Global stats)

Settings options
    PLAYERS_SEE_SELF:   Allow Player to see their own data
    PLAYERS_SEE_PLAYERS: Allow players to see other players data 
    PLAYERS_SEE_GM:     Allow players to see GM stats
    PLAYERS_SEE_GLOBAL: Allow player to see global values
    DISABLE_STREAKS:    Disable displaying of streaks in chat. Still Stored in data
    SEE_BLIND_STREAK:   Allow player to view blind streaks (If a die rolled in the streak was blind dont display value)

Access the Roll Tracker from the Player List in the bottom-left.
![Access Roll Tracker]()

Player Stats
![Player]()

Global Stats
![Global]()

Streaks
![Streaks]()

Planned Features
    Bar Graph to display Dice Results
    Output to Chat how many Nat1 & 20's have been rolled by that player when one gets rolled
    Streaks in Both Direction


