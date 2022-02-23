1. About the Project
2. Built with
3. Usage
4. Roadmap
5. License
6. Contact
7. Acknowledgments


1. About the project:
Noodler is a lightweight online DAW created specifically to allow users to share musical ideas. 
Users can create chords, rhythms, patterns, scales, modules (a 'riff' with musical context) and songs and store them locally or share them with the world.
This app is recommended for intermediate guitar players and especially those who have an interest in jazz. 

2. Built with:
-React.js
-Node.js
-Express.js
-MongoDB
-Redux

3. Usage
Overview: 
Noodler uses drag and drop interface.
All parts of the module are draggable, as well as the module itself. 
If you want to get a deeper look at a pattern, rhythm, scale, etc. drag and drop it over the Lab.
The Palette is for temporary storage, just drag and drop something you want into it. 
The Explorer is where you can find premade ingredients.
The Player is where you can play and rearrange 

3.1 Navbar
    -Login
    Login if you already have a username and password
    -Register
    Register if you do not yet have an acount
3.2 Instrument Display
    -Instrument Options
    Click on Gear icon next to the instrument name to show the options for that instrument.
        -Strings
        Decreasing the amount of strings will remove the lowest string currently displayed.
        Increasing the amount of strings will cause a string to be added a perfect fourth lower than the current lowest string. 
        There is no hard limit on the amount of strings that an instrument can support, only that no string can be tuned lower than C0.
        -Instrument Type
        Changing the instrument type changes the sound of the instrument. When changing to/from a bass instrument, the display will also change.
        -Tuning
        Changing the tuning can also change the amount of strings on an instrument. Custom tunings will be available in the next update.
        -Frets
        The maximum amount of frets is 36, and the minimum is 0. 
    -Instrument Name
        Click on the name in order to change it.
    -Media Control Symbols
    From left to right
        -Stop
        stops the playback and sets playback time to 0 (the beginning of the track)
        -Pause
        pauses the playback - position remains the same
        -Play
        plays modules from the player
        -Loop
        toggle loop on/off for the entire song
        -Previous Module (previous track symbol)
        sets playback time to the beginning of the previous module
        -Current module (eject symbol)
        sets playback time to the beginning of the current module
        -Next Module (next track symbol)
        sets playback time to the beginning of the next module
        -Lower position (down arrow)
        changes the position of the notes to be lower on the fretboard (i.e. closer to the nut)
        -High position (up arrow)
        changes the position of the notes to be higher on the fretboard (i.e. closer to the bridge)
    -Notes on the instrument display
    Any instrument can play any note. Whether that note is displayed depends on the range of the instrument (i.e., the number of frets, tuning, and strings on your instrument)
    You can hide instruments by clicking the name of that instrument on the center bar (see center bar for more details)
    You can mute an instrument through the player section (see player for more details)

3.3 Center Bar
The center bar is mainly for toggling visibility between components.
From left to right.
-Explorer
Toggles the Explorer, which is used to find rhythms, patterns, songs, etc.
-Lab
Toggles the Lab, which is used to create and analyze, rhythms, patterns, scales, chords, etc...
-Palette
Toggles the Palette, which is used for temporary storage
-Player
Toggles the Player, which is used for creating songs and changing playback options
-Instr 1 (or your instrument)
Clicking on any of the instrument names on right side of the bar will toggle their visability
- + / - signs
Add or Remove an instrument. New instruments will be creating will be Acoustic Guitar Nylon, 6 strings, with EADGBE tuning (custom default options coming soon).
3.4 Explorer
Find patterns, rhythms, chords, scales, modules, and songs to noodle with. 
-Search Bar 
Search by author name, data name, or description
-Pool Selector
If you're not logged in, only the global pool of data will be available to you
    -Global: See all pieces of data uploaded to the global pool
    -Local: See only your private pieces of data
    -Other: Custom pools will be available soon
Type Selector:
-Chord
-Rhythm
-Pattern
-Scale
-Module 
-Song 

3.5 Lab
The lab is where you can create, inspect, and edit pieces of musical data.

3.5.0 Importing into the lab 
You can import any scale, chord, pattern, rhythm or module from the Explorer, Palette, or Player by dragging that data over the lab dropping it in. 
All scales, chords, patterns, rhythms, and modules creating in the Lab can also be dragged out of the lab and dropped into The Explorer, Palette, or Player
3.5.1 Scale Lab
    What is a scale?
    -A scale is a collection of notes. For the sake of this app, a scale is a unique collection of notes such that [A, B, C, D, E, F, G] is not the same as [G, A, B, C, D, E, F]. 
    -In Noodler, [A, B, C, D, E, F, G] and [G, A, B, C, D, E, F] are both unique scales as well as modes of each other. 
    -In Nooodler, scales determine what notes are played by the 'pattern' in the module
-Scale Controls
From Left to Right
-Hashtag/lowercase b
Toggles between flats and Sharps Displayed
-Root
Set the Root of the Scale
-Play Button
Plays the scale
-Play Options (down carrot next to play button)
Toggle between forwards, backwards, and random play options
-Random Button
Generate a random scale 
-Random Options (down carrot next to random button)
sets parameters for random generator
-Range 
    -Only 
    Set the min and max to the same number - generated scales will have only that amount of notes
    -Min 
    Set the minimum amount of notes that a randomly generated scale can have
    -Max 
    Set the maximum amount of notes that a randomly generated scale can have
    -Full 
    Set the minimum to 1 and the maximum to 12, allowing all possible scale lengths to be generated
-Randomness
    -Named scales
    will return only scales that have names
    -True random 
    will return any scale
-Init 
set scale to major 
-Mode 
Left and right arrows shift between different modes of the scale.
I.E. -> [A, B, C, D, E, F, G] -> [G, A, B, C, D, E, F]
-Desc
Shows the description for a scale. When importing a scale, description should contain hints on situations to use it in. 
Be sure to put a description on a scale if it is unusual and you plan on exporting it globally.
Bad description: 'This scale is bussin LOL'
Good description: 'This scale is bussin LOL. Use it over III7 chords, brosky.'
-Export Button
Will export the scale to whatever you have set (warning, no feedback yet. It exports instantly, just trust me)
-Export options
Set where you want the scale to be exported to when you hit the Export button
-Global 
-Local

-Scale Name
The name of the scale, click on it to change the name. Scales without conventional names will be displayed as only the number.
Please give the numbered scales a name.
-Scale Number
The scale number is a base 10 version of the scale in binary. Despite what the numbers may say, there are only 2048 possible scales.
Scale number is useful when the scale has no name.
**Note, the scale numbers in Noodler do not reflect the other scale numbering techniques found on other sites.

-Scale display:
Displays the scale 

-Scale Switches:
Remove or add pitches to the scale. Only included to show off the 'binary nature' of scales.

3.5.2 Chord Lab
-What is a chord?
A chord is a collection of notes that are played simultaneously. 
-Chord Controls
-Play
Plays the chord progression
-Generate Button
Generates a chord progression based on the scale in the scale label
-Generate Controls (carrot dropdown next to generate button)
    -Character
    Determines the 'character' of the chord
    -interval size 
    What intervals are used to create the chord
    Set to 3, and you'll generate regular triads, set to 4, and you'll generate quartal chords
    -# of notes
    How many notes will comprise a single chord? Set to 4, and you'll generate 7th chords, set to 5 and you'll get 9th chords...etc 
-Edit 
Toggles editing options
    -Editing Options 
    Selecting the editing options will change the behavior of the arrows on the notes of the chord. 
    The arrows next to each note will only adjust that note, but the arrows at the bottom of the chord will adjust all of the notes within the chord. Chords can be moved in a drag or drop fashion. 
    -Octave 
    change note/chord by octave 
    -Scale
    change note/chord by scale (indicated in the scale lab)
    -Chromatic
    change note/chord chromatically
    -Insert 
    Make a clone of the note/chord
    -Delete the note/chord
-Desc
Toggles on description. Description in the chord lab is only meant for the first chord displayed. If you have a really strange chord, please name it and give suggestions on its usage and possible scales to play over it (if possible).
-Export 
Export the chord (first chord)
-Export options
Determine where you want the chord to be exported
-Naming the chord
Just click on the Chord name 
-Exporting the chords
You drag any chord or the chord export name out of the lab into the palette or lab
3.5.2 Pattern Lab
-What is a pattern?
A pattern is a set of instructions that tells the player what degrees of the scale to play.

Example if a pattern is (0, 2, 4, 5, 6, 7, 10)
And the scale is set to C Major (C, D, E, F, G, A, B)
Then the output will be C3, E3, G3, A3, B3, C4, F4

*0 for any pattern is the first note of the scale at the third octave
-Play
Play the pattern
-Generate
Create a new pattern (only random patterns as of now)
-Generate Dropdown 
    -length of pattern 
    adjust length of pattern in notes 
-Edit
    -toggle between off, on, all edit modes 
-Edit: On 
    Like the edit mode in the chord lab section, use the buttons to change the action of each arrow.
    -Octave 
        change note by octave 
    -Scale 
        change note by scale degree (determined by scale lab)
    -Chromatic 
        change note chromatically
    -Insert 
        clone the note by
    -Delete
        delete the note 
-Edit: All
    Changes all notes at once. Toggle between modes and use the Up and Down buttons to change the notes 
    -Octave 
        change all notes by octave 
    -Scale 
        change all notes by scale 
    -Chromatic 
        change all notes chromatically 
    -Delete 
        delete all notes (!!!)
-Manipulate 
    Alters the pattern on a large scale 
    -Shuffle
    randomly arrange notes 
    -Reverse Melody 
    reverse the melody
    -Invert Melody 
    Inverts the melody on a chromatic axis 
    -Fit Pattern To Scale 
    Updates the pattern to fit the scale (if the scale was changed without creating a new pattern)
-Options 
    -View
    Toggle between View:Notes and View:Pattern
        -View:Notes
        See the pattern as notes that will be played
        -View:Pattern
        See the pattern in the pattern position format 
    -Play on Keypress
        -When on: Allows the use of the keyboard to input notes manually
    -Scale Lock
        -Only applicable when Play on Keypress is On. With Scale Lock Enabled, you can only play notes that are within the selected scale.
    -Play Note on Click 
        -When on, notes in the pattern lab will play on click 
-Desc 
    Create a description of the pattern that you are creating. Names like 'Arp up' or 'Play over dm' work well.
-Export
    Export the pattern 
-Export Options 
    Choose where to export your pattern

3.5.3 Rhythm Lab
    What is a rhythm? 
    A rhythm is the space in time in which the notes are played. 
    In the rhythm lab, X's are silent while O's are played. 
    Each 'block' of notes represents 1 beat. The blocks remain the same length, no matter how many notes insert. 
    For instance, if you put 3 notes into a block, those three notes in the length of one beat as 'triplets'.
    Rhythm lab allows for nested tuplets up to four levels deep. 
    I.E. you can put a triplets

    Rhythm Lab options
    -Play 
    Play the rhythm
    -Generate 
    Generate a random rhythm
    -Edit
    Toggle the edit options view 
        -X/O
        turns a note from on to off or vice versa ('X' is off, 'O' is on)
        -Add 
        adds a note at the level clicked 
        -Remove 
        removes a note at the level clicked 
        -Subdivide
            Creates a nested tuplet inside of the note clicked
            -2/3/4
            adjusts the size of the tuplet added 
        -Undivide 
            Removes a nested tuplet. Must click the border of a tuplet for it to work. 
        -Notes--
            Removes a 'block' note, shortening the phrase length
        -Notes++
            Adds a 'block' note, lengthening the phrase length 
    -Stretch/Compress 
        -Increase or decrease the length of the rhythm by change the speed that the phrase is played at. 
    -Desc 
        Create a description for your rhythm. 
    -Export 
        Export the rhythm
    -Export Options
        Choose which pool to export to 
    
3.5.4 Module Lab
    -What is a module?
    A Module is a unit of musical information that contains a scale, a chord, a pattern, a rhythm, and a key.
    Modules are the building blocks of Songs which can be played in the Player.
    Module Lab Options
    -Play 
    Plays the module
    -Key 
    Changes the key of the module. Useful for musical context 
    -Desc 
    Create a description of the module 
    Export
    Export the module 
    Export Options 
    Choose where the module is exported


3.6 Palette
-The Palette is for temporary storage. 
Drag and drop any piece of musical data onto the palette, and the palette will automatically open that section and store the new data.

3.7 Player
-The player is where modules are played in sequential order in order to become songs. 
-Modules, and musical data can all be dragged and dropped in order to rearrange parts on the fly.

-Song Options
-Instrument Selector 
Select which instrument the Player is focusing on. The instrument that is highlighted is the one that is being changed. 
*Note when creating a new instrument, the new instrument is a clone of the first instrument, which is treated as 'Master Instrument'. 
-Mode Selector
Select Which mode that instrument is going to be played as
    -Mode: Off 
        Instrument display and sound is off
    -Mode: Melody 
        The Scale, Pattern, and Rhythm Data are combined in order to play a melody. 
    -Mode: Chord 
        The Chord and Pattern Data are combined in order to play a chordal accompaniment.
    -Mode: Display Scale
        The Scale in each module is displayed and the sound is off.
    -Mode: Display Chord Tones
        The Chord Tones in each module are displayed and the sound is off. 
-Edit 
Turns on and off the edit options 
    -Swap 
    Swap the starting music data or module with the ending piece or module.
    -Replace 
    replace the starting music data or module with the ending music data or module. 
    -Reorder
    Only works with modules. Move the module in front of another module by shifting the remaining modules back in line.
    -Fill 
    (Use With Caution) Replace all pieces of similar music data or modules with the selected music data or module. Fill Either left or right. 
    -Delete 
    (Use With Caution) Delete the selected module 
    -Module--
    Remove the last module in the sequence 
    -Module++ 
    Add another module to the sequence by cloning the last module 
-BPM
Change the global BPM
-Desc 
Add a description for your song 
-Export 
Export your song. Includes instrument data as well as player data.
-Export Options 
Choose where to Export your song
-Song Title 
Click to change song title 

4. Roadmap
-display chord/scale from lab
-recommended scales in player
-save custom tunings
-manage collections
-polyphonic patterns
-position edit
-download tab
-export midi
-export mp3








